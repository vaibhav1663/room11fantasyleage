export interface Player {
  pid: string;
  name: string;
  role: string;
  rawPoints: string;
  teamName: string;
  playingEleven: boolean;
}

export interface Team {
  _id?: string;
  roomId: string;
  name: string;
  captain: number; // entityPlayerId
  viceCaptain: number; // entityPlayerId
  players: number[]; // array of entityPlayerIds
  createdAt?: Date;
}

export interface LeaderboardResponse {
  playerList: Player[];
}

export interface Room {
  _id?: string;
  name: string;
  slug: string;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
}

export interface MatchPlayer {
  name: string;
  playerId: string;
  entityPlayerId: number;
  isPlayingEleven: boolean;
  role: string;
  playing_role: string;
  teamName?: string;
  teamAbbr?: string;
}

export interface TeamData {
  teamName: string;
  teamAbbr: string;
  playersList: MatchPlayer[];
}

export interface MatchPlayersResponse {
  message: string;
  data: TeamData[];
}

export interface ScoreCardData {
  title: string;
  short_title: string;
  team_1: any;
  team_2: any;
  live_inning_number: string;
  status_note: string;
  toss_result: string;
  toss_winner: string;
  status_str: string;
  winning_team_id: number | null;
  tournament_name: string;
}