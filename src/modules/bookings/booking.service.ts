import { prisma } from "../../lib/prisma.js";
import {
  BookingStatus,
  PaymentStatus,
  Slot,
} from "../../../prisma/generated/prisma/client.js";
import {
  AcceptBookingDto,
  CancelBookingDto,
  CreateBookingDto,
  GetUserBookingsQuery,
} from "./booking.types.js";

export class BookingService {
  static generateReference(): string {
    return `BK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  static async create(userId: string, data: CreateBookingDto) {
    const baseAmount = 1020;
    let discountAmount = 0;

    if (data.offerCode === "PLAY20") {
      discountAmount = baseAmount * 0.2;
    }

    const totalAmount = baseAmount - discountAmount;
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
        slot: Slot.SLOT1,
        sport: data.sport,
        playersPerTeam: data.playersPerTeam,
        baseAmount: baseAmount,
        discountAmount: discountAmount,
        totalAmount: totalAmount,
        status: BookingStatus.PENDING,
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
