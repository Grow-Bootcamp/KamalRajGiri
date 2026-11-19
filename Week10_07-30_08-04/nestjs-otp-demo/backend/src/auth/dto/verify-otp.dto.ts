import { IsString, IsUUID, Matches } from "class-validator";

export class VerfyOtpDto{
    @IsUUID()
    challengeId!:string;

    @IsString()
    @Matches(/^\d{6}$/,{
        message: `OTP must contain exactly 6 digits`,
    })
    otp!: string;
}