import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TRPCModule } from 'nestjs-trpc';

import { HealthRouter } from './health/health.router';
import { CitiesRouter } from './cities/cities.router';
import { AuthRouter } from './auth/auth.router';
import { AuthService } from './auth/auth.service';
import { AppContext } from './trpc/trpc.context';
import { RegionsRouter } from './regions/regions.router';
import { RegionsService } from './regions/regions.service';
import { ParksRouter } from './parks/parks.router';
import { ParksService } from './parks/parks.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TRPCModule.forRoot({
      context: AppContext,
    }),
  ],

  providers: [
    HealthRouter,
    CitiesRouter,
    AuthRouter,
    AuthService,
    AppContext,
    RegionsRouter,
    RegionsService,
    ParksRouter,
    ParksService,
  ],
})
export class AppModule {}
