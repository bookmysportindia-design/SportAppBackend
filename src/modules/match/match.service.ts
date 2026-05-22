import { prisma } from "../../lib/prisma.js";
import { CreateMatchDto, GetMatchesQuery } from "./match.types.js";

export class MatchService {
  static async getMatches(userId: string | undefined, query: GetMatchesQuery) {
    const { date, status, type, page = 1, limit = 10, search } = query as any;

    const where: any = {};
    if (userId) where.booking = { userId };

    if (status) where.status = status;
    if (type) where.type = type;

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      where.matchDate = { gte: start, lte: end };
    }

    if (search && typeof search === "string" && search.trim().length > 0) {
      const s = search.trim();
      where.OR = [
        { booking: { referenceNumber: { contains: s, mode: "insensitive" } } },
        { booking: { venue: { name: { contains: s, mode: "insensitive" } } } },
        {
          teams: {
            some: { team: { name: { contains: s, mode: "insensitive" } } },
          },
        },
      ];
    }

    const skip = (page - 1) * limit;

    const [matches, total] = await Promise.all([
      prisma.match.findMany({
        where,
        include: {
          booking: {
            select: {
              referenceNumber: true,
              bookingDate: true,
              slot: true,
              sport: true,
              venue: { select: { id: true, name: true } },
            },
          },
          teams: { include: { team: { select: { id: true, name: true } } } },
        },
        orderBy: { matchDate: "asc" },
        skip,
        take: limit,
      }),
      prisma.match.count({ where }),
    ]);

    return {
      data: matches,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  static async createMatch(userId: string, matchData: CreateMatchDto) {
    // Validate that booking exists and belongs to user
    const booking = await prisma.booking.findUnique({
      where: { id: matchData.bookingId },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.userId !== userId) {
      throw new Error("You can only create matches for your own bookings");
    }

    // Check if booking already has a match
    if (booking.matchId) {
      throw new Error("This booking already has an associated match");
    }

    const match = await prisma.match.create({
      data: {
        type: matchData.type,
        matchDate: matchData.matchDate,
        paymentMethod: matchData.paymentMethod,
        status: matchData.status || "PAYMENT_PENDING",
        bookingId: matchData.bookingId,
      },
      include: {
        booking: true,
      },
    });
    return match;
  }
}
