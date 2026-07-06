import {
  InviteStatus,
  InviteType,
  MatchStatus,
} from "../../../prisma/generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import {
  CreateMatchDto,
  GetMatchesQuery,
  SendMatchInviteDto,
  RequestJoinMatchDto,
  RespondToMatchInviteDto,
} from "./match.types.js";

const INVITABLE_STATUSES: MatchStatus[] = [
  MatchStatus.PAYMENT_PENDING,
  MatchStatus.UNDER_REVIEW,
  MatchStatus.SCHEDULED,
];

async function validateMatchForInvite(matchId: string, teamId: string) {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      teams: true,
      booking: { select: { playersPerTeam: true } },
    },
  });
  if (!match) throw new Error("Match not found");
  if (!INVITABLE_STATUSES.includes(match.status))
    throw new Error("Match is not in an invitable status");
  if (match.matchDate < new Date())
    throw new Error("Match date has already passed");

  const isTeamInMatch = match.teams.some((mt) => mt.teamId === teamId);
  if (!isTeamInMatch) throw new Error("Team is not part of this match");

  return match;
}

async function checkSquadCapacity(
  matchId: string,
  teamId: string,
  playersPerTeam: number,
) {
  const count = await prisma.matchPlayer.count({
    where: { matchId, teamId },
  });
  if (count >= playersPerTeam)
    throw new Error("Team squad is full for this match");
}

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
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      where.matchDate = { gte: today };
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
              startTime: true,
              endTime: true,
              sport: true,
              venue: { select: { id: true, name: true, address: true } },
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

  static async sendMatchInvite(captainId: string, data: SendMatchInviteDto) {
    const match = await validateMatchForInvite(data.matchId, data.teamId);

    const team = await prisma.team.findUnique({ where: { id: data.teamId } });
    if (!team) throw new Error("Team not found");
    if (team.captainId !== captainId)
      throw new Error("Only captain can send match invites");

    const alreadyInSquad = await prisma.matchPlayer.findUnique({
      where: { matchId_userId: { matchId: data.matchId, userId: data.playerId } },
    });
    if (alreadyInSquad) throw new Error("Player is already in the match squad");

    await checkSquadCapacity(data.matchId, data.teamId, match.booking.playersPerTeam);

    await prisma.matchInvite.updateMany({
      where: {
        matchId: data.matchId,
        teamId: data.teamId,
        recipientId: data.playerId,
        type: InviteType.INVITE,
        status: InviteStatus.PENDING,
      },
      data: { status: InviteStatus.EXPIRED },
    });

    return prisma.matchInvite.create({
      data: {
        type: InviteType.INVITE,
        matchId: data.matchId,
        teamId: data.teamId,
        initiatorId: captainId,
        recipientId: data.playerId,
        expiresAt: match.matchDate,
      },
      include: {
        match: { select: { matchDate: true, type: true } },
        team: { select: { name: true, sport: true } },
      },
    });
  }

  static async requestJoinMatch(playerId: string, data: RequestJoinMatchDto) {
    const match = await validateMatchForInvite(data.matchId, data.teamId);

    const team = await prisma.team.findUnique({ where: { id: data.teamId } });
    if (!team) throw new Error("Team not found");

    const alreadyInSquad = await prisma.matchPlayer.findUnique({
      where: { matchId_userId: { matchId: data.matchId, userId: playerId } },
    });
    if (alreadyInSquad) throw new Error("You are already in the match squad");

    await checkSquadCapacity(data.matchId, data.teamId, match.booking.playersPerTeam);

    await prisma.matchInvite.updateMany({
      where: {
        matchId: data.matchId,
        teamId: data.teamId,
        initiatorId: playerId,
        type: InviteType.JOIN_REQUEST,
        status: InviteStatus.PENDING,
      },
      data: { status: InviteStatus.EXPIRED },
    });

    return prisma.matchInvite.create({
      data: {
        type: InviteType.JOIN_REQUEST,
        matchId: data.matchId,
        teamId: data.teamId,
        initiatorId: playerId,
        recipientId: team.captainId,
        expiresAt: match.matchDate,
      },
      include: {
        match: { select: { matchDate: true, type: true } },
        team: { select: { name: true, sport: true } },
      },
    });
  }

  static async respondToMatchInvite(userId: string, data: RespondToMatchInviteDto) {
    const invite = await prisma.matchInvite.findUnique({
      where: { id: data.inviteId },
      include: {
        match: { include: { booking: { select: { playersPerTeam: true } } } },
      },
    });
    if (!invite) throw new Error("Invite not found");
    if (invite.recipientId !== userId)
      throw new Error("Not authorized to respond to this invite");
    if (invite.status !== InviteStatus.PENDING)
      throw new Error("Invite is no longer pending");
    if (invite.expiresAt < new Date()) {
      await prisma.matchInvite.update({
        where: { id: data.inviteId },
        data: { status: InviteStatus.EXPIRED },
      });
      throw new Error("Invite has expired");
    }

    if (!data.accept) {
      await prisma.matchInvite.update({
        where: { id: data.inviteId },
        data: { status: InviteStatus.DECLINED },
      });
      return { message: "Invite declined" };
    }

    const newPlayerId =
      invite.type === InviteType.INVITE
        ? invite.recipientId
        : invite.initiatorId;

    await checkSquadCapacity(
      invite.matchId,
      invite.teamId,
      invite.match.booking.playersPerTeam,
    );

    await prisma.$transaction(async (tx) => {
      await tx.matchInvite.update({
        where: { id: data.inviteId },
        data: { status: InviteStatus.ACCEPTED },
      });
      await tx.matchPlayer.create({
        data: {
          matchId: invite.matchId,
          userId: newPlayerId,
          teamId: invite.teamId,
        },
      });
    });

    return { message: "Accepted — player added to match squad" };
  }

  static async getMyMatchInvites(userId: string) {
    return prisma.matchInvite.findMany({
      where: { recipientId: userId, status: InviteStatus.PENDING },
      include: {
        match: { select: { id: true, matchDate: true, type: true, status: true } },
        team: { select: { id: true, name: true, sport: true } },
        initiator: { select: { id: true, name: true, phone: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getMatchInvites(captainId: string, matchId: string, teamId: string) {
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) throw new Error("Team not found");
    if (team.captainId !== captainId)
      throw new Error("Only captain can view match invites");

    return prisma.matchInvite.findMany({
      where: { matchId, teamId },
      include: {
        initiator: { select: { id: true, name: true, phone: true } },
        recipient: { select: { id: true, name: true, phone: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getMatchSquad(matchId: string) {
    return prisma.matchPlayer.findMany({
      where: { matchId },
      include: {
        user: { select: { id: true, name: true, phone: true, profilePicture: true } },
        team: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "asc" },
    });
  }
}
