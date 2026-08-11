import { Module } from '@nestjs/common';
import { TRPCModule } from 'nestjs-trpc';
import { AppController } from './app.controller';
import { HealthRouter } from './health.router';
import { AppService } from './app.service';

@Module({
  imports: [TRPCModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, HealthRouter],
})
export class AppModule {}
