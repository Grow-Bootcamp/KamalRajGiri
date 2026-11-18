import { Module } from '@nestjs/common';
import { OtpService } from './otp.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { OtpCleanupService } from './otp-cleanup.service.js';

@Module({
  imports: [PrismaModule],
  providers: [OtpService, OtpCleanupService],
  exports: [OtpService],
})
export class OtpModule {}
