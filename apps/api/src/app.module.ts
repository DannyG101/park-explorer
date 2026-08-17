import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TRPCModule } from 'nestjs-trpc';

import { HealthRouter } from './health/health.router';
import { CitiesRouter } from './cities/cities.router';
import { AuthRouter } from './auth/auth.router';
import { AuthService } from './auth/auth.service';
import { AppContext } from './trpc/trpc.context';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TRPCModule.forRoot({
      context: AppContext,
    }),
  ],

  providers: [HealthRouter, CitiesRouter, AuthRouter, AuthService, AppContext],
})
export class AppModule {}
