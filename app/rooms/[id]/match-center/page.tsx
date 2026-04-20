"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Room, Team, TeamData, Player } from '../../../types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy } from "lucide-react";
import Link from 'next/link';

export default function MatchCenterPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [room, setRoom] = useState<Room | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [playersData, setPlayersData] = useState<TeamData[]>([]);
  const [playerData, setPlayerData] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomRes = await fetch(`/api/rooms/${params.id}`);
        const roomData = await roomRes.json();
        setRoom(roomData);

        if (roomData.slug) {
          const playersRes = await fetch(`/api/match-players?slug=${roomData.slug}`);
          const playersResponse = await playersRes.json();
          
          if (playersResponse.message === 'SUCCESS' && playersResponse.data) {
            setPlayersData(playersResponse.data);
          }

          const fantasyRes = await fetch(`https://apis.fancraze.com/challenge3/challenge/V3/getFantasyPointLeaderboard?slug=${roomData.slug}`);
          const fantasyData = await fantasyRes.json();
          if (fantasyData?.data?.playerList) {
            setPlayerData(fantasyData.data.playerList);
          }
        }

        const teamsRes = await fetch(`/api/rooms/${params.id}/add-team`);
        const teamsData = await teamsRes.json();
        setTeams(teamsData);
        setSelectedTeams(teamsData.map((t: Team) => t.name));
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const getPlayerName = (entityPlayerId: number): string => {
    for (const teamData of playersData) {
      const player = teamData.playersList.find(p => p.entityPlayerId === entityPlayerId);
      if (player) return player.name;
    }
    return 'Unknown';
  };

  const findLeaderboardPlayer = (entityPlayerId: number) => {
    return playerData.find(p => String(p.pid) === String(entityPlayerId));
  };

  const getPlayerPoints = (entityPlayerId: number, isCaptain: boolean, isViceCaptain: boolean) => {
    const player = findLeaderboardPlayer(entityPlayerId);
    if (!player) return { raw: 0, multiplied: 0 };

    const points = parseFloat(player.rawPoints);
    let multipliedPoints = points;

    if (isCaptain) {
      multipliedPoints *= 2;
    } else if (isViceCaptain) {
      multipliedPoints *= 1.5;
    }

    return {
      raw: points,
      multiplied: multipliedPoints
    };
  };

  const getAllPlayersSorted = () => {
    const playersMap = new Map<number, {
      entityPlayerId: number;
      name: string;
      points: number;
      teams: Array<{
        teamName: string;
        isCaptain: boolean;
        isViceCaptain: boolean;
      }>;
    }>();

    teams.forEach(team => {      // Skip teams that are not selected
      if (!selectedTeams.includes(team.name)) return;
      team.players.forEach(entityPlayerId => {
        const playerName = getPlayerName(entityPlayerId);
        const isCaptain = entityPlayerId === team.captain;
        const isViceCaptain = entityPlayerId === team.viceCaptain;
        const points = getPlayerPoints(entityPlayerId, false, false);

        if (!playersMap.has(entityPlayerId)) {
          playersMap.set(entityPlayerId, {
            entityPlayerId,
            name: playerName,
            points: points.raw,
            teams: []
          });
        }

        playersMap.get(entityPlayerId)!.teams.push({
          teamName: team.name,
          isCaptain,
          isViceCaptain
        });
      });
    });

    return Array.from(playersMap.values()).sort((a, b) => b.points - a.points);
  };

  const toggleTeam = (teamName: string) => {
    setSelectedTeams(prev => 
      prev.includes(teamName) 
        ? prev.filter(t => t !== teamName)
        : [...prev, teamName]
    );
  };

  const selectAllTeams = () => {
    setSelectedTeams(teams.map(t => t.name));
  };

  const deselectAllTeams = () => {
    setSelectedTeams([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 p-8">
        <div className="text-center text-neutral-900 dark:text-white">
          Loading match center...
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 p-8">
        <div className="text-center text-neutral-900 dark:text-white">
          Room not found
        </div>
      </div>
    );
  }

  const sortedPlayers = getAllPlayersSorted();

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 pt-16">
      <div className="container mx-auto p-3 sm:p-0 max-w-4xl">
        <div className="mb-6">
          <Link href={`/rooms/${params.id}`}>
            <Button variant="ghost" className="text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Room
            </Button>
          </Link>
        </div>

        <Card className="bg-white dark:bg-neutral-950 mb-6 border-none">
          <CardHeader className="p-0 sm:p-0">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
              Match Center - {room.name}
            </CardTitle>
          </CardHeader>
        </Card>

        <div className="flex flex-wrap gap-2 mb-6">
          {teams.map(team => (
            <Button
              key={team.name}
              variant="outline"
              size="sm"
              onClick={() => toggleTeam(team.name)}
              className={`transition-all ${
                selectedTeams.includes(team.name)
                  ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 border-neutral-900 dark:border-neutral-100'
                  : 'bg-white dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              {team.name}
            </Button>
          ))}
          <Button 
            variant="outline" 
            size="sm"
            onClick={selectAllTeams}
            className="text-neutral-900 dark:text-white"
          >
            Select All
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={deselectAllTeams}
            className="text-neutral-900 dark:text-white"
          >
            Deselect All
          </Button>
        </div>

        <div className="space-y-3 pb-12">
          {sortedPlayers.map((player, index) => (
            <Card 
              key={player.entityPlayerId}
              className="bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-700 transition-all hover:shadow-lg"
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white mb-2">
                      {player.name}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {player.teams.map((team, teamIndex) => (
                        <Badge 
                          key={teamIndex}
                          variant={team.isCaptain || team.isViceCaptain ? undefined : "outline"}
                          className={`${
                            team.isCaptain 
                              ? 'bg-yellow-500 hover:bg-yellow-600 text-white border-0' 
                              : team.isViceCaptain 
                              ? 'bg-purple-500 hover:bg-purple-600 text-white border-0' 
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-600'
                          }`}
                        >
                          {team.teamName}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="relative flex items-center justify-center overflow-visible">
                    <span
                      className="font-black text-transparent bg-clip-text bg-gradient-to-b from-neutral-400 to-neutral-600 dark:from-[#E2E2E2] dark:to-[#6B6B6B] select-none leading-none"
                      style={{
                        fontSize: '60px',
                        WebkitTextStroke: '1px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      {player.points.toFixed(0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedPlayers.length === 0 && (
          <Card className="bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-700">
            <CardContent className="p-8 text-center">
              <p className="text-neutral-600 dark:text-neutral-400">
                No player data available yet
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
