import { prisma } from "../../lib/prisma.js";

interface UpdateUserDto {
  name?: string;
  email?: string;
  profilePicture?: string;
}

export class UserService {
  static async getById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phone: true,
        name: true,
        email: true,
        profilePicture: true,
        createdAt: true,
        venues: true,
      },
    });
  }

  // Returns all users; both filters are optional and can be combined
  static async getAll(
    filters: { name?: string; phone?: string },
    excludeId?: string,
  ) {
    const conditions = [
      ...(filters.name
        ? [{ name: { contains: filters.name, mode: "insensitive" as const } }]
        : []),
      ...(filters.phone ? [{ phone: { contains: filters.phone } }] : []),
    ];
    return prisma.user.findMany({
      where: {
        ...(excludeId && { id: { not: excludeId } }),
        ...(conditions.length && { OR: conditions }),
      },
      select: {
        id: true,
        phone: true,
        name: true,
        email: true,
        profilePicture: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async update(userId: string, data: UpdateUserDto) {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  }
}
