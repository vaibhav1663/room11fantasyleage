export interface Player {
  pid: string;
  name: string;
  role: string;
  point: string;
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