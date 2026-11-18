import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { OtpModule } from './otp/otp.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? 'V75Mo7v9p7K$zsMf',
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'HTHnrXW8&nUiAyY4m1r0AbCqe2Yb%XJoD1!$MSs06NnH8',
      serviceId: 'backend',
    }),
    AuthModule,
    PrismaModule,
    OtpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
