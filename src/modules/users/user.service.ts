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

  static async update(userId: string, data: UpdateUserDto) {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  }
}
