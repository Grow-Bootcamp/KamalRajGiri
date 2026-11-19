import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomInt } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service.js';
import { comparePassword, hashPassword } from '../auth/password.util.js';

@Injectable()
export class OtpService {
    constructor(private readonly prisma: PrismaService){}

    async generateOtp(userId:number){
        const otp = randomInt(100000, 1000000).toString();
        const codeHash = await hashPassword(otp);

        const expiresAt = new Date(Date.now() + 10*60*1000);

        const otpRecord = await this.prisma.otp.create({
            data:{
                codeHash,
                expiresAt,
                userId,
            },
            select:{
                id:true,
                expiresAt:true,
            },
        });

        console.log(`OTP for User ${userId} : ${otp}`);

        return{
            challengeId: otpRecord.id,
            expiresAt:otpRecord.expiresAt,
        };
    }

    async verifyOtp(challengeId:string, otp:string){
        const otpRecord = await this.prisma.otp.findUnique({
            where:{id:challengeId},
        });

        if(!otpRecord){
            throw new UnauthorizedException('Invalid or expired OTP');
        }

        if(otpRecord.expiresAt <= new Date()){
            await this.prisma.otp.delete({
                where:{id:challengeId},
            });
            throw new UnauthorizedException('Invalid or expired token');
        }

         if (otpRecord.attempts >= 5) {
    await this.prisma.otp.delete({
      where: { id: challengeId },
    });

    throw new UnauthorizedException('Maximum OTP attempts exceeded');
  }

  const isValid = await comparePassword(otp, otpRecord.codeHash);

  if (!isValid) {
    const nextAttempts = otpRecord.attempts + 1;

    if (nextAttempts >= 5) {
      await this.prisma.otp.delete({
        where: { id: challengeId },
      });

      throw new UnauthorizedException('Maximum OTP attempts exceeded');
    }

    await this.prisma.otp.update({
      where: { id: challengeId },
      data: { attempts: { increment: 1 } },
    });

    throw new UnauthorizedException('Invalid or expired OTP');
  }

  // OTP is one-time use: delete after successful verification.
  await this.prisma.otp.delete({
    where: { id: challengeId },
  });

  return {
    message: 'OTP verified successfully',
    verified: true,
    userId: otpRecord.userId,
  };
    }
}
