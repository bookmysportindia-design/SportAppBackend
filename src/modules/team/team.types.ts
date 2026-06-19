import { Sport } from "../../../prisma/generated/prisma/enums.js";

export interface CreateTeamDto {
  teamName: string;
  city: string;
  sport: Sport;
  primaryGround: string | null;
}

export interface SendInviteDto {
  teamId: string;
  playerId: string; // player to invite
}

export interface RequestJoinDto {
  teamId: string; // team to request joining
}

export interface RespondToInviteDto {
  inviteId: string;
  accept: boolean;
}

export interface RemovePlayerDto {
  teamId: string;
  playerId: string;
}

export interface ToggleRecruitingDto {
  teamId: string;
  isRecruiting: boolean;
}

// Max players per team per sport (including captain)
export const SPORT_MAX_PLAYERS: Record<Sport, number> = {
  [Sport.CRICKET]: 11,
  [Sport.FOOTBALL]: 11,
};
