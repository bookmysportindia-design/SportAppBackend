import { prisma } from "../../lib/prisma.js";
import { BookingStatus } from "../../../prisma/generated/prisma/client.js";
import type { CreateVenueDto } from "./venue.types.js";

const SLOT_DURATION_MINUTES: Record<string, number> = {
  ONE_HOUR: 60,
  ONE_AND_HALF_HOURS: 90,
  TWO_HOURS: 120,
  THREE_HOURS: 180,
};

function toMinutes(time: string): number {
  const parts = time.split(":").map(Number);
  return (parts[0] ?? 0) * 60 + (parts[1] ?? 0);
}

function fromMinutes(mins: number): string {
  const h = Math.floor(mins / 60)
    .toString()
    .padStart(2, "0");
  const m = (mins % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

const DAY_MAP: Record<number, string> = {
  0: "SUN",
  1: "MON",
  2: "TUE",
  3: "WED",
  4: "THU",
  5: "FRI",
  6: "SAT",
};

function parseDateOnly(date: string): { year: number; month: number; day: number } {
  const parts = date.split("-").map(Number);
  const year = parts[0] ?? 1970;
  const month = (parts[1] ?? 1) - 1;
  const day = parts[2] ?? 1;
  return { year, month, day };
}

function formatDateOnly(d: Date): string {
  const y = d.getUTCFullYear();
  const m = (d.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = d.getUTCDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}

type CalendarView = "day" | "week" | "month";

function getDateRange(date: string, view: CalendarView): string[] {
  const { year, month, day } = parseDateOnly(date);

  if (view === "day") {
    return [date];
  }

  if (view === "week") {
    return Array.from({ length: 7 }, (_, i) =>
      formatDateOnly(new Date(Date.UTC(year, month, day + i))),
    );
  }

  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return Array.from({ length: daysInMonth }, (_, i) =>
    formatDateOnly(new Date(Date.UTC(year, month, i + 1))),
  );
}

interface ListVenueParams {
  city?: string;
  sport?: string;
  page?: string;
  limit?: string;
  sort?: "name" | "createdAt";
}

export class VenueService {
  static async list(params: ListVenueParams) {
    const page = params.page ? parseInt(params.page) : 1;
    const limit = params.limit ? parseInt(params.limit) : 10;

    const skip = (page - 1) * limit;

    const venues = await prisma.venue.findMany({
      where: {
        ...(params.city && { city: params.city }),
        ...(params.sport && {
          sportTypes: {
            has: params.sport,
          },
        }),
      },
      orderBy: {
        [params.sort || "createdAt"]: "desc",
      },
      include: {
        favoritedBy: true,
        pitches: true,
      },
      skip,
      take: limit,
    });

    return venues;
  }

  static async getMyVenues(id: string) {
    return prisma.venue.findMany({
      where: { ownerId: id },
      include: {
        pitches: true,
        dayPricings: true,
        timeSlotPricings: true,
        slotTiers: true,
        discountConfigs: true,
        bankDetails: true,
      },
    });
  }

  static async create(userId: string, data: CreateVenueDto) {
    return prisma.$transaction(async (tx) => {
      const owner = await tx.user.findUnique({
        where: { id: userId },
        select: { phone: true },
      });

      if (!owner?.phone) {
        throw new Error("Owner contact number not found");
      }

      const venue = await tx.venue.create({
        data: {
          name: data.name,
          groundType: data.groundType,
          contactNumber: owner.phone,
          city: data.city,
          state: data.state,
          address: data.address,
          landmark: data.landmark ?? null,
          description: data.description ?? null,
          latitude: data.latitude ?? null,
          longitude: data.longitude ?? null,
          openingTime: data.openingTime,
          closingTime: data.closingTime,
          slotDuration: data.slotDuration,
          workingDays: data.workingDays,
          sportTypes: data.sportTypes,
          amenities: data.amenities,
          photos: data.photos,
          ownerId: userId,
        },
      });

      if (data.pitches?.length) {
        await tx.pitch.createMany({
          data: data.pitches.map((p) => ({
            pitchType: p.pitchType,
            surfaceType: p.surfaceType,
            name: p.name ?? null,
            boundary: p.boundary ?? null,
            venueId: venue.id,
          })),
        });
      }

      if (data.bankDetails) {
        await tx.venueBankDetails.create({
          data: { ...data.bankDetails, venueId: venue.id },
        });
      }

      if (data.documents?.length) {
        await tx.venueDocument.createMany({
          data: data.documents.map((d) => ({ ...d, venueId: venue.id })),
        });
      }

      if (data.dayPricings?.length) {
        await tx.dayPricing.createMany({
          data: data.dayPricings.map((d) => ({ ...d, venueId: venue.id })),
        });
      }

      if (data.timeSlotPricings?.length) {
        await tx.timeSlotPricing.createMany({
          data: data.timeSlotPricings.map((t) => ({ ...t, venueId: venue.id })),
        });
      }

      if (data.slotTiers?.length) {
        await tx.slotTier.createMany({
          data: data.slotTiers.map((s) => ({
            name: s.name,
            multiplier: s.multiplier,
            description: s.description ?? null,
            venueId: venue.id,
          })),
        });
      }

      if (data.discountConfigs?.length) {
        await tx.discountConfig.createMany({
          data: data.discountConfigs.map((d) => ({ ...d, venueId: venue.id })),
        });
      }

      return tx.venue.findUnique({
        where: { id: venue.id },
        include: {
          pitches: true,
          bankDetails: true,
          documents: true,
          dayPricings: true,
          timeSlotPricings: true,
          slotTiers: true,
          discountConfigs: true,
        },
      });
    });
  }

  static async toggleFavorite(userId: string, venueId: string) {
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_venueId: { userId, venueId },
      },
    });

    if (existing) {
      return await prisma.favorite.delete({
        where: { id: existing.id },
      });
    } else {
      return await prisma.favorite.create({
        data: { userId, venueId },
      });
    }
  }

  static async getFavoriteVenues(userId: string) {
    return prisma.favorite.findMany({
      where: { userId },
      include: { venue: { include: { favoritedBy: true } } },
    });
  }

  static async getById(venueId: string) {
    return prisma.venue.findUnique({
      where: { id: venueId },
      include: {
        pitches: { include: { tier: true } },
      },
    });
  }

  static async getPitchSlots(
    venueId: string,
    pitchId: string,
    date: string,
    view: CalendarView,
  ) {
    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
      include: {
        dayPricings: true,
        timeSlotPricings: true,
        discountConfigs: true,
      },
    });

    if (!venue) {
      throw new Error("Venue not found");
    }

    const pitch = await prisma.pitch.findFirst({
      where: { id: pitchId, venueId },
      include: { tier: true },
    });

    if (!pitch) {
      throw new Error("Pitch not found");
    }

    const dates = getDateRange(date, view);
    const durationMins = SLOT_DURATION_MINUTES[venue.slotDuration] ?? 60;
    const openMins = toMinutes(venue.openingTime);
    const closeMins = toMinutes(venue.closingTime);
    const pitchTierMultiplier = pitch.tier?.multiplier ?? 1;

    const friendlyDiscount = venue.discountConfigs.find(
      (d) => d.bookingType === "FRIENDLY",
    );
    const discountPercent =
      friendlyDiscount?.discountType === "PERCENTAGE"
        ? friendlyDiscount.value
        : undefined;

    const firstDate = dates[0] ?? date;
    const lastDate = dates[dates.length - 1] ?? date;
    const rangeStart = new Date(firstDate);
    const rangeEnd = new Date(
      new Date(lastDate).getTime() + 24 * 60 * 60 * 1000,
    );

    const existingBookings = await prisma.booking.findMany({
      where: {
        venueId,
        pitchId,
        bookingDate: { gte: rangeStart, lt: rangeEnd },
        status: { not: BookingStatus.CANCELLED },
      },
      select: { bookingDate: true, startTime: true, endTime: true },
    });

    const bookedSlots = new Set(
      existingBookings.map(
        (b) => `${formatDateOnly(b.bookingDate)}-${b.startTime}-${b.endTime}`,
      ),
    );

    const days = dates.map((d) => {
      const { year, month, day } = parseDateOnly(d);
      const dayIndex = new Date(Date.UTC(year, month, day)).getUTCDay();
      const dayKey = DAY_MAP[dayIndex] ?? "MON";
      const isWorkingDay = venue.workingDays.includes(dayKey);

      if (!isWorkingDay) {
        return { date: d, isWorkingDay: false, slots: [] };
      }

      const dayPricing = venue.dayPricings.find((p) => p.day === dayKey);
      const basePrice = dayPricing?.basePrice ?? 0;

      const slots = [];
      let current = openMins;
      while (current + durationMins <= closeMins) {
        const startTime = fromMinutes(current);
        const endTime = fromMinutes(current + durationMins);

        const timeSlot = venue.timeSlotPricings.find(
          (t) => startTime >= t.startTime && startTime < t.endTime,
        );
        const timeMultiplier = timeSlot?.multiplier ?? 1;
        const price = Math.round(basePrice * timeMultiplier * pitchTierMultiplier);

        slots.push({
          startTime,
          endTime,
          price,
          tierName: timeSlot?.name,
          discountPercent,
          status: bookedSlots.has(`${d}-${startTime}-${endTime}`)
            ? ("booked" as const)
            : ("available" as const),
        });

        current += durationMins;
      }

      return { date: d, isWorkingDay: true, slots };
    });

    return {
      pitch: { id: pitch.id, name: pitch.name },
      view,
      days,
    };
  }
}
