import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SendOtpDto, VerifyOtpDto, AuthResponse } from "./auth.types";
import { prisma } from "../../lib/prisma";
import axios from "axios";
import { env } from "../../config/env";

const OTP_EXPIRY_MS = 10 * 60 * 1000;

export class AuthService {
  static generateOtp(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  static async sendOtp(data: SendOtpDto): Promise<void> {
    const otp = this.generateOtp();
    const otpHash = await bcrypt.hash(otp, 7);

    await prisma.otp.create({
      data: {
        phone: data.phone,
        otpHash,
        expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
      },
    });

    console.log(`OTP for ${data.phone}: ${otp}`);

    // Call a2z otp sms sending API here with axios
    const message = `WFO Sports: Dear John, your OTP for login is ${otp}. It is valid for 10 minutes. Do not share it with anyone.`;
    const response = await axios.get("http://sms.a2zsms.in/api.php", {
      params: {
        username: env.A2Z_USERNAME,
        password: env.A2Z_PASSWORD,
        to: data.phone,
        from: env.A2Z_FROM,
        message,
        PEID: env.A2Z_PEID,
        templateid: env.A2Z_TEMPLATE_ID,
      },
    });

    // console.log("SMS API Response:", response.data);
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

  static async getUserInfo(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    return user;
  }
}
