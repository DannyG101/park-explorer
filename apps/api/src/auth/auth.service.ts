import { Injectable } from '@nestjs/common';
import { TRPCError } from '@trpc/server';
import * as argon2 from 'argon2';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'node:crypto';

import { db, sessions, users } from '@park-explorer/db';

import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  async register(input: RegisterDto) {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, input.email),
    });

    if (existingUser) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Email already registered',
      });
    }

    const passwordHash = await argon2.hash(input.password);

    const [user] = await db
      .insert(users)
      .values({
        name: input.name,
        email: input.email,
        passwordHash,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
      });

    return user;
  }

  async login(input: LoginDto) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, input.email),
    });

    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid email or password',
      });
    }

    const passwordMatches = await argon2.verify(
      user.passwordHash,
      input.password,
    );

    if (!passwordMatches) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid email or password',
      });
    }

    const token = randomBytes(32).toString('hex');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await db.insert(sessions).values({
      token,
      userId: user.id,
      expiresAt,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  }

  async me(token: string) {
    const session = await db.query.sessions.findFirst({
      where: eq(sessions.token, token),
      with: {
        user: true,
      },
    });

    if (!session) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Not logged in',
      });
    }

    if (session.expiresAt < new Date()) {
      await db.delete(sessions).where(eq(sessions.token, token));

      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Session expired',
      });
    }

    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
    };
  }

  async logout(token: string) {
    await db.delete(sessions).where(eq(sessions.token, token));

    return { message: 'Logged out successfully' };
  }
}
