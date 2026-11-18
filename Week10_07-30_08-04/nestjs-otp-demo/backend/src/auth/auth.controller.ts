
import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { VerfyOtpDto } from './dto/verify-otp.dto.js';
import { type AuthenticatedRequest, JwtAuthGuard } from './jwt-auth.guard.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('verify-otp')
  verifyOtp(@Body() verifyOtpDto: VerfyOtpDto) {
    return this.authService.verifyOtp(
      verifyOtpDto.challengeId,
      verifyOtpDto.otp,
    );
  }

  @Get('me')
@UseGuards(JwtAuthGuard)
getProfile(@Req() req: AuthenticatedRequest) {
  return this.authService.getProfile(req.user.sub);
}
}
