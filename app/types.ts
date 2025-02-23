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