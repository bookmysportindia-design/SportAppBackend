import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SendOtpDto, VerifyOtpDto, AuthResponse } from "./auth.types";
import { prisma } from "../../lib/prisma";

const OTP_EXPIRY_MS = 5 * 60 * 1000;

export class AuthService {
  static generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static async sendOtp(data: SendOtpDto): Promise<void> {
    const otp = this.generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);

    await prisma.otp.create({
      data: {
        phone: data.phone,
        otpHash,
        expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
      },
    });

    // TODO: Call STPL API here with axios
    console.log(`OTP for ${data.phone}: ${otp}`);
  }

  static async verifyOtp(data: VerifyOtpDto): Promise<AuthResponse> {
    const record = await prisma.otp.findFirst({
      where: {
        phone: data.phone,
        verified: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!record) {
      throw new Error("Invalid OTP");
    }

    if (record.expiresAt < new Date()) {
      throw new Error("OTP expired");
    }

    const isValid = await bcrypt.compare(data.otp, record.otpHash);

    if (!isValid) {
      throw new Error("Incorrect OTP");
    }

    await prisma.otp.update({
      where: { id: record.id },
      data: { verified: true },
    });

    let user = await prisma.user.findUnique({
      where: { phone: data.phone },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { phone: data.phone },
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET not configured");
    }

    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "7d" });

    return {
      token,
      user: {
        id: user.id,
        phone: user.phone,
      },
    };
  }
}
