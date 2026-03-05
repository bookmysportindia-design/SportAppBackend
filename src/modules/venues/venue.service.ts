import { prisma } from "../../lib/prisma";
import { createVenueSchema } from "./venue.schema";

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
      skip,
      take: limit,
    });

    return venues;
  }

  static async getMyVenues(id: string) {
    return prisma.venue.findMany({
      where: { ownerId: id },
    });
  }

  static async create(userId: string, data: any) {
    return prisma.venue.create({
      data: {
        name: data.venueName,
        contactNumber: data.venueHandlerContactNumber,
        // googleMapsLink: data.googleMapsLink,
        // locality: data.locality,
        city: data.city,
        address: `${data.locality}, ${data.city}, ${data.pincode}`,
        longitude: data.logitudinalValue,
        amenities: data.amenities,
        openingTime: data.opensAt,
        closingTime: data.closesAt,
        sportTypes: data.sportTypes,
        // equipmentAvailable: data.equipmentAvailable,
        // pincode: data.pincode,
        workingDays: data.workingDays,
        // pricesWeekdays: data.prices_weekdays,
        // pricesWeekends: data.prices_weekends,
        ownerId: userId,
      },
    });
  }
}
