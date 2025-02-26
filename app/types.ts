export interface Player {
  pid: string;
  name: string;
  role: string;
  rawPoints: string;
  teamName: string;
  playingEleven: boolean;
}

export interface Team {
  name: string;
  captain: string;
  viceCaptain: string;
  players: string[];
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
  teams: Team[];
  createdAt: Date;
}

export interface MatchPlayer {
  name: string;
  playerId: string;
  entityPlayerId: number;
  isPlayingEleven: boolean;
  teamName: string;
  teamAbbr: string;
  playingRole: string;
  playingElevenMatchIdList: string[];
}

export interface MatchPlayersResponse {
  data: {
    [key: string]: MatchPlayer;
  };
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