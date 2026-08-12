import { Module } from '@nestjs/common';
import { TRPCModule } from 'nestjs-trpc';
import { HealthRouter } from './health/health.router';
import { ConfigModule } from '@nestjs/config';
import { CitiesRouter } from './cities/cities.router';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TRPCModule.forRoot(),
  ],
  providers: [HealthRouter, CitiesRouter],
})
export class AppModule {}
