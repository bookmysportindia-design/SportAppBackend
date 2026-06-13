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
      },
    });
  }

  // Returns all users; both filters are optional and can be combined
  static async getAll(filters: { name?: string; phone?: string }) {
    return prisma.user.findMany({
      where: {
        // name is case-insensitive partial match; phone is exact partial match (digits are case-irrelevant)
        ...(filters.name && {
          name: { contains: filters.name, mode: "insensitive" },
        }),
        ...(filters.phone && {
          phone: { contains: filters.phone },
        }),
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
