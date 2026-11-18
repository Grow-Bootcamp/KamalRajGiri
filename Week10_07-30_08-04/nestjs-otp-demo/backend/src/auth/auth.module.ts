import { Module } from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { OtpModule } from '../otp/otp.module.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';


@Module({
  imports: [
    PrismaModule, 
    OtpModule,
    JwtModule.registerAsync({
      useFactory: () => {
        const secret = process.env.JWT_SECRET;
        if(!secret){
          throw new Error('JWT_SECRET is not configured');
        }

        return {
          secret,
          signOptions: {
            expiresIn: '30m',
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtAuthGuard]
})
export class AuthModule {}
