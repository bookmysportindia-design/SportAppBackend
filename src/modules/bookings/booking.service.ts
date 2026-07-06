import { prisma } from "../../lib/prisma.js";
import {
  BookingStatus,
  PaymentStatus,
} from "../../../prisma/generated/prisma/client.js";
import type {
  Venue,
  DayPricing,
  TimeSlotPricing,
  SlotTier,
  DiscountConfig,
} from "../../../prisma/generated/prisma/client.js";
import {
  AcceptBookingDto,
  BookingPreviewDto,
  CancelBookingDto,
  ConfirmBookingDto,
  GetUserBookingsQuery,
} from "./booking.types.js";

type VenueWithPricing = Venue & {
  dayPricings: DayPricing[];
  timeSlotPricings: TimeSlotPricing[];
  slotTiers: SlotTier[];
  discountConfigs: DiscountConfig[];
};

const DAY_MAP: Record<number, string> = {
  0: "SUN", 1: "MON", 2: "TUE", 3: "WED", 4: "THU", 5: "FRI", 6: "SAT",
};

export class BookingService {
  static generateReference(): string {
    return `BK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  static calculatePrice(
    venue: VenueWithPricing,
    bookingDate: Date,
    startTime: string,
    tierId?: string,
    matchType?: string,
  ) {
    const dayKey = DAY_MAP[bookingDate.getDay()];

    const dayPricing = venue.dayPricings.find((d) => d.day === dayKey);
    const basePrice = dayPricing?.basePrice ?? 0;

    const timeSlot = venue.timeSlotPricings.find(
      (t) => startTime >= t.startTime && startTime < t.endTime,
    );
    const timeMultiplier = timeSlot?.multiplier ?? 1;

    let tierMultiplier = 1;
    if (tierId) {
      const tier = venue.slotTiers.find((t) => t.id === tierId);
      tierMultiplier = tier?.multiplier ?? 1;
    }

    const subtotal = Math.round(basePrice * timeMultiplier * tierMultiplier);

    let discountAmount = 0;
    if (matchType) {
      const discount = venue.discountConfigs.find(
        (d) => d.bookingType === matchType,
      );
      if (discount) {
        discountAmount =
          discount.discountType === "PERCENTAGE"
            ? Math.round(subtotal * (discount.value / 100))
            : Math.round(discount.value);
      }
    }

    return {
      baseAmount: subtotal,
      discountAmount,
      totalAmount: subtotal - discountAmount,
    };
  }

  private static async getVenueWithPricing(venueId: string) {
    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
      include: {
        dayPricings: true,
        timeSlotPricings: true,
        slotTiers: true,
        discountConfigs: true,
      },
    });
    if (!venue) throw new Error("Venue not found");
    return venue;
  }

  private static async resolveTierId(
    venueId: string,
    pitchId?: string,
    tierId?: string,
  ): Promise<string | undefined> {
    if (!pitchId) return tierId;

    const pitch = await prisma.pitch.findFirst({
      where: { id: pitchId, venueId },
    });
    if (!pitch) throw new Error("Pitch not found");

    return pitch.tierId ?? tierId;
  }

  static async preview(data: BookingPreviewDto) {
    const venue = await this.getVenueWithPricing(data.venueId);
    const bookingDate = new Date(data.bookingDate);
    const tierId = await this.resolveTierId(
      data.venueId,
      data.pitchId,
      data.tierId,
    );

    const { baseAmount, discountAmount, totalAmount } = this.calculatePrice(
      venue,
      bookingDate,
      data.startTime,
      tierId,
      data.matchType,
    );

    const discount = data.matchType
      ? venue.discountConfigs.find((d) => d.bookingType === data.matchType)
      : null;

    return {
      venue: { id: venue.id, name: venue.name },
      bookingDate: data.bookingDate,
      startTime: data.startTime,
      endTime: data.endTime,
      sport: data.sport,
      slotPrice: baseAmount,
      discount: discount
        ? { label: discount.name, amount: discountAmount }
        : null,
      totalAmount,
    };
  }

  static async confirm(userId: string, data: ConfirmBookingDto) {
    const venue = await this.getVenueWithPricing(data.venueId);
    const bookingDate = new Date(data.bookingDate);
    const tierId = await this.resolveTierId(
      data.venueId,
      data.pitchId,
      data.tierId,
    );

    const existing = await prisma.booking.findFirst({
      where: {
        venueId: data.venueId,
        ...(data.pitchId ? { pitchId: data.pitchId } : {}),
        bookingDate: {
          gte: new Date(data.bookingDate),
          lt: new Date(new Date(data.bookingDate).getTime() + 24 * 60 * 60 * 1000),
        },
        startTime: data.startTime,
        endTime: data.endTime,
        status: { not: BookingStatus.CANCELLED },
      },
    });

    if (existing) {
      throw new Error("Slot is no longer available");
    }

    const { baseAmount, discountAmount, totalAmount } = this.calculatePrice(
      venue,
      bookingDate,
      data.startTime,
      tierId,
      data.matchType,
    );

    const booking = await prisma.booking.create({
      data: {
        referenceNumber: this.generateReference(),
        bookingDate,
        startTime: data.startTime,
        endTime: data.endTime,
        sport: data.sport,
        playersPerTeam: data.playersPerTeam,
        baseAmount,
        discountAmount,
        totalAmount,
        status: BookingStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PAID,
        userId,
        venueId: data.venueId,
        ...(data.pitchId ? { pitchId: data.pitchId } : {}),
      },
      include: {
        venue: true,
      },
    });

    return booking;
  }

  static async getUserBookings(userId: string, query: GetUserBookingsQuery) {
    const { date } = query;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return prisma.booking.findMany({
      where: {
        userId,
        bookingDate: date
          ? {
              gte: new Date(date),
              lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
            }
          : { gte: today },
      },
      orderBy: {
        bookingDate: "asc",
      },
      include: {
        venue: true,
      },
    });
  }

  static async cancel(userId: string, data: CancelBookingDto) {
    const { bookingId } = data;
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking || booking.userId !== userId) {
      throw new Error("Booking not found");
    }

    return prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CANCELLED,
        paymentStatus: PaymentStatus.REFUNDED,
        cancelledAt: new Date(),
      },
    });
  }

  static async getBusinessBookingRequests(userId: string) {
    const venues = await prisma.venue.findMany({
      // where: { ownerId: userId },
    });

    const bookingRequests = await prisma.booking.findMany({
      where: {
        venueId: { in: venues.map((v) => v.id) },
        status: BookingStatus.PENDING,
      },
      include: {
        venue: true,
        user: true,
      },
    });
    return bookingRequests;
  }

  static async acceptBookingRequest(data: AcceptBookingDto) {
    const { bookingId } = data;
    try {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });

      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: BookingStatus.CONFIRMED,
        },
      });

      return booking;
    } catch (error) {
      console.error("Error accepting booking request:", error);
      throw new Error("Failed to accept booking request");
    }
  }
}
