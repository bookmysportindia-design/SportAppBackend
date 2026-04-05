import {
  EntityType,
  InviteStatus,
  InviteType,
  Role,
} from "../../../prisma/generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import {
  AddMemberDto,
  CreateTeamDto,
  RequestJoinDto,
  RespondToInviteDto,
  SendInviteDto,
  SPORT_MAX_PLAYERS,
} from "./team.types.js";

const INVITE_EXPIRY_DAYS = 7;

function inviteExpiresAt() {
  const d = new Date();
  d.setDate(d.getDate() + INVITE_EXPIRY_DAYS);
  return d;
}

async function getTeamMemberCount(teamId: string): Promise<number> {
  return prisma.membership.count({
    where: { entityId: teamId, entityType: EntityType.TEAM },
  });
}

export class TeamService {
  static async createTeam(userId: string, data: CreateTeamDto) {
    return await prisma.$transaction(async (tx) => {
      const team = await tx.team.create({
        data: {
          name: data.teamName,
          city: data.city,
          sport: data.sport,
          primaryGround: data.primaryGround,
          captainId: userId,
        },
      });

      await tx.membership.create({
        data: {
          entityId: team.id,
          entityType: EntityType.TEAM,
          userId: userId,
          role: Role.CAPTAIN,
        },
      });

      return team;
    });
  }

  static async addMember(userId: string, data: AddMemberDto) {
    const team = await prisma.team.findUnique({ where: { id: data.teamId } });
    if (!team) throw new Error("Team not found");
    if (team.captainId !== userId)
      throw new Error("Only captain can add members");

    const existing = await prisma.membership.findFirst({
      where: {
        entityId: data.teamId,
        entityType: EntityType.TEAM,
        userId: data.playerId,
      },
    });
    if (existing) throw new Error("User already a member");

    const count = await getTeamMemberCount(data.teamId);
    if (count >= SPORT_MAX_PLAYERS[team.sport]) {
      throw new Error(
        `Team is full (max ${SPORT_MAX_PLAYERS[team.sport]} players for ${team.sport})`,
      );
    }

    await prisma.membership.create({
      data: {
        entityId: team.id,
        entityType: EntityType.TEAM,
        userId: data.playerId,
        role: Role.PLAYER,
      },
    });
  }

  // Captain invites a player
  static async sendInvite(captainId: string, data: SendInviteDto) {
    const team = await prisma.team.findUnique({ where: { id: data.teamId } });
    if (!team) throw new Error("Team not found");
    if (team.captainId !== captainId)
      throw new Error("Only captain can send invites");

    const alreadyMember = await prisma.membership.findFirst({
      where: {
        entityId: data.teamId,
        entityType: EntityType.TEAM,
        userId: data.playerId,
      },
    });
    if (alreadyMember) throw new Error("User is already a team member");

    const count = await getTeamMemberCount(data.teamId);
    if (count >= SPORT_MAX_PLAYERS[team.sport]) {
      throw new Error(
        `Team is full (max ${SPORT_MAX_PLAYERS[team.sport]} players for ${team.sport})`,
      );
    }

    // Cancel any existing pending invite to the same player
    await prisma.teamInvite.updateMany({
      where: {
        teamId: data.teamId,
        recipientId: data.playerId,
        type: InviteType.INVITE,
        status: InviteStatus.PENDING,
      },
      data: { status: InviteStatus.EXPIRED },
    });

    return prisma.teamInvite.create({
      data: {
        type: InviteType.INVITE,
        teamId: data.teamId,
        initiatorId: captainId,
        recipientId: data.playerId,
        expiresAt: inviteExpiresAt(),
      },
      include: { team: { select: { name: true, sport: true } } },
    });
  }

  // Player requests to join a team
  static async requestJoin(playerId: string, data: RequestJoinDto) {
    const team = await prisma.team.findUnique({ where: { id: data.teamId } });
    if (!team) throw new Error("Team not found");

    const alreadyMember = await prisma.membership.findFirst({
      where: {
        entityId: data.teamId,
        entityType: EntityType.TEAM,
        userId: playerId,
      },
    });
    if (alreadyMember) throw new Error("You are already a member of this team");

    const count = await getTeamMemberCount(data.teamId);
    if (count >= SPORT_MAX_PLAYERS[team.sport]) {
      throw new Error(
        `Team is full (max ${SPORT_MAX_PLAYERS[team.sport]} players for ${team.sport})`,
      );
    }

    // Cancel any existing pending request from the same player
    await prisma.teamInvite.updateMany({
      where: {
        teamId: data.teamId,
        initiatorId: playerId,
        type: InviteType.JOIN_REQUEST,
        status: InviteStatus.PENDING,
      },
      data: { status: InviteStatus.EXPIRED },
    });

    return prisma.teamInvite.create({
      data: {
        type: InviteType.JOIN_REQUEST,
        teamId: data.teamId,
        initiatorId: playerId,
        recipientId: team.captainId,
        expiresAt: inviteExpiresAt(),
      },
      include: { team: { select: { name: true, sport: true } } },
    });
  }

  // Respond to an invite or join request
  static async respondToInvite(userId: string, data: RespondToInviteDto) {
    const invite = await prisma.teamInvite.findUnique({
      where: { id: data.inviteId },
      include: { team: true },
    });
    if (!invite) throw new Error("Invite not found");
    if (invite.recipientId !== userId)
      throw new Error("Not authorized to respond to this invite");
    if (invite.status !== InviteStatus.PENDING)
      throw new Error("Invite is no longer pending");
    if (invite.expiresAt < new Date()) {
      await prisma.teamInvite.update({
        where: { id: data.inviteId },
        data: { status: InviteStatus.EXPIRED },
      });
      throw new Error("Invite has expired");
    }

    if (!data.accept) {
      await prisma.teamInvite.update({
        where: { id: data.inviteId },
        data: { status: InviteStatus.DECLINED },
      });
      return { message: "Invite declined" };
    }

    // Recheck team capacity before accepting
    const count = await getTeamMemberCount(invite.teamId);
    if (count >= SPORT_MAX_PLAYERS[invite.team.sport]) {
      throw new Error(
        `Team is full (max ${SPORT_MAX_PLAYERS[invite.team.sport]} players for ${invite.team.sport})`,
      );
    }

    const newMemberId =
      invite.type === InviteType.INVITE
        ? invite.recipientId // player is accepting the captain's invite
        : invite.initiatorId; // captain is accepting the player's join request

    await prisma.$transaction(async (tx) => {
      await tx.teamInvite.update({
        where: { id: data.inviteId },
        data: { status: InviteStatus.ACCEPTED },
      });
      await tx.membership.create({
        data: {
          entityId: invite.teamId,
          entityType: EntityType.TEAM,
          userId: newMemberId,
          role: Role.PLAYER,
        },
      });
    });

    return { message: "Accepted — player added to team" };
  }

  // Get all pending invites/requests for the logged-in user
  static async getMyInvites(userId: string) {
    return prisma.teamInvite.findMany({
      where: { recipientId: userId, status: InviteStatus.PENDING },
      include: {
        team: { select: { id: true, name: true, sport: true, city: true } },
        initiator: { select: { id: true, name: true, phone: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Captain views all invites/requests for their team
  static async getTeamInvites(captainId: string, teamId: string) {
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) throw new Error("Team not found");
    if (team.captainId !== captainId)
      throw new Error("Only captain can view team invites");

    return prisma.teamInvite.findMany({
      where: { teamId },
      include: {
        initiator: { select: { id: true, name: true, phone: true } },
        recipient: { select: { id: true, name: true, phone: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getTeams() {
    return prisma.team.findMany();
  }
}
