export interface SendOtpDto {
  phone: string;
}

export interface VerifyOtpDto {
  phone: string;
  otp: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    phone: string;
  };
}
