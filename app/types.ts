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