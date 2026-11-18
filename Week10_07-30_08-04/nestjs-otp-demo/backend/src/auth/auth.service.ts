import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { comparePassword, hashPassword } from './password.util.js';
import { OtpService } from '../otp/otp.service.js';


@Injectable()
export class AuthService {
constructor (
    private readonly prisma:PrismaService,
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService,
){}

async register(registerDto: RegisterDto){
    const {fullName, email, password} = registerDto;

    const existingUser = await this.prisma.user.findUnique({
        where: {email},
    });

    if(existingUser){
        throw new ConflictException('Email is already registered');
    }
        const passwordHash = await hashPassword(password);

        const user = await this.prisma.user.create({
            data:{
                fullName,
                email,
                passwordHash,
            },
            select: {
                id:true,
                fullName: true,
                email:true,
                createdAt:true,
            },
        });
        return{
            message:'Registration Successful!',
            user,
        };
    
}


async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await comparePassword(
        password,
        user.passwordHash,
    );

    if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
    }

    const challenge = await this.otpService.generateOtp(user.id);

    return {
        message: 'OTP generated successfully!',
        user: {
            id: user.id,
            email: user.email,
        },
        challenge,
    };
}


async verifyOtp(challengeId: string, otp: string) {
  const result = await this.otpService.verifyOtp(challengeId, otp);

  const user = await this.prisma.user.findUnique({
    where: { id: result.userId },
    select: {
      id: true,
      fullName: true,
      email: true,
    },
  });

  if (!user) {
    throw new UnauthorizedException('User account not found');
  }

  const accessToken = await this.jwtService.signAsync({
    sub: user.id,
    email: user.email,
  });

  return {
    message: 'OTP verified successfully',
    verified: true,
    accessToken,
    tokenType: 'Bearer',
    expiresIn: 900,
    user,
  };
}

async getProfile(userId: number) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      fullName: true,
      email: true,
    },
  });

  if (!user) {
    throw new UnauthorizedException('User account not found');
  }

  return { user };
}
}