import { prisma } from "../../lib/prisma";
import { BookingStatus, PaymentStatus } from "../../../prisma/generated/prisma/client";

interface CreateBookingDto {
  venueId: string;
  bookingDate: string;
  slot: "MORNING" | "AFTERNOON" | "EVENING";
  sport: "CRICKET" | "FOOTBALL";
  playersPerTeam: number;
}

export class BookingService {
  static generateReference(): string {
    return `BK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  static async create(userId: string, data: CreateBookingDto) {
    const venue = await prisma.venue.findUnique({
      where: { id: data.venueId },
    });

    if (!venue) {
      throw new Error("Venue not found");
    }

    const booking = await prisma.booking.create({
      data: {
        referenceNumber: this.generateReference(),
        bookingDate: new Date(data.bookingDate),
        slot: data.slot,
        sport: data.sport,
        playersPerTeam: data.playersPerTeam,
        totalAmount: 1000, // dummy value
        status: BookingStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PAID,
        userId,
        venueId: data.venueId,
      },
      include: {
        venue: true,
      },
    });

    return booking;
  }

  static async getUserBookings(userId: string, date?: string) {
    return prisma.booking.findMany({
      where: {
        userId,
        ...(date && {
          bookingDate: {
            gte: new Date(date),
            lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
          },
        }),
      },
      orderBy: {
        bookingDate: "asc",
      },
      include: {
        venue: true,
      },
    });
  }

  static async cancel(userId: string, bookingId: string) {
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
}
