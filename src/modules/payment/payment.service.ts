import axios from "axios";
import { env } from "../../config/env";
import { createOrderDto, OrderTokenResponse } from "./payment.types";

export class PaymentService {
  private static accessToken: string | null = null;
  private static expiresAt: number = 0;

  static async getPhonePeAccessToken(): Promise<string> {
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);

    // 1. Check if we have a valid token (with 5-minute buffer)
    if (
      PaymentService.accessToken &&
      PaymentService.expiresAt - currentTimeInSeconds > 300
    ) {
      return PaymentService.accessToken;
    }

    // 2. Otherwise, fetch a new one
    const tokenUrl =
      env.NODE_ENV === "production"
        ? "https://api.phonepe.com/apis/identity-manager/v1/oauth/token"
        : "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token";

    try {
      const response = await axios.post(
        tokenUrl,
        new URLSearchParams({
          client_id: env.PHONEPE_CLIENTID,
          client_version: env.PHONEPE_CLIENT_VERSION,
          client_secret: env.PHONEPE_CLIENT_SECRET,
          grant_type: "client_credentials",
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      const { access_token, expires_at } = response.data;

      // 3. Store the new token and expiry
      PaymentService.accessToken = access_token;
      PaymentService.expiresAt = currentTimeInSeconds + expires_at;

      return PaymentService.accessToken!;
    } catch (error) {
      console.error(
        "PhonePe Auth Error:",
        error,
        // error.response?.data || error.message,
      );
      throw new Error("Failed to obtain PhonePe access token");
    }
  }

  static generateUniqueOrderId(): string {
    return `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }

  static async createPhonePeOrderToken(
    data: createOrderDto,
  ): Promise<OrderTokenResponse> {
    const accessToken = await PaymentService.getPhonePeAccessToken();

    const orderTokenUrl =
      env.NODE_ENV === "production"
        ? "https://api.phonepe.com/apis/pg/checkout/v2/sdk/order"
        : "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/sdk/order";

    try {
      const response = await axios.post(
        orderTokenUrl,
        {
          merchantOrderId: PaymentService.generateUniqueOrderId(),
          amount: data.amount,
          paymentFlow: {
            type: "PG_CHECKOUT",
            paymentModeConfig: {
              enabledPaymentModes: [
                {
                  type: "UPI_INTENT",
                },
                {
                  type: "UPI_COLLECT",
                },
                {
                  type: "UPI_QR",
                },
                {
                  type: "NET_BANKING",
                },
                {
                  type: "CARD",
                  cardTypes: ["DEBIT_CARD", "CREDIT_CARD"],
                },
              ],
            },
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `O-Bearer ${accessToken}`,
          },
        },
      );

      const { orderId, token, expiryAt, state } = response.data;

      return { orderId, state, expiryAt, token };
    } catch (error) {
      console.error("PhonePe Order Token Error:", error);
      throw new Error("Failed to create PhonePe order token");
    }
  }
}
