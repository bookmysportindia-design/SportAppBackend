import { prisma } from "../../lib/prisma";

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
}
