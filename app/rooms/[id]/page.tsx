"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { Room, MatchPlayer, Team, TeamData } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Trophy, Star, Clock, AlertTriangle, Share2 } from "lucide-react";
import Link from 'next/link';
import Scores from '@/components/scores';

export default function RoomPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [room, setRoom] = useState<Room | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [playersData, setPlayersData] = useState<TeamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [newTeam, setNewTeam] = useState<Partial<Team>>({
    name: '',
    captain: undefined,
    viceCaptain: undefined,
    players: []
  });

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
        }

        const teamsRes = await fetch(`/api/rooms/${params.id}/add-team`);
        const teamsData = await teamsRes.json();
        setTeams(teamsData);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!room) return;

    try {
      const response = await fetch(`/api/rooms/${params.id}/add-team`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTeam),
      });

      if (!response.ok) throw new Error('Failed to add team');

      const createdTeam = await response.json();
      setTeams([createdTeam, ...teams]);
      setShowAddTeam(false);
      setNewTeam({
        name: '',
        captain: undefined,
        viceCaptain: undefined,
        players: []
      });
    } catch (error) {
      console.error('Error adding team:', error);
    }
  };

  const handlePlayerSelect = (entityPlayerId: number) => {
    if (!newTeam.players) return;

    if (newTeam.players.includes(entityPlayerId)) {
      setNewTeam({
        ...newTeam,
        players: newTeam.players.filter(p => p !== entityPlayerId),
        captain: newTeam.captain === entityPlayerId ? undefined : newTeam.captain,
        viceCaptain: newTeam.viceCaptain === entityPlayerId ? undefined : newTeam.viceCaptain
      });
    } else if (newTeam.players.length < 11) {
      setNewTeam({
        ...newTeam,
        players: [...newTeam.players, entityPlayerId]
      });
    }
  };

  const handleCaptainSelect = (entityPlayerId: number) => {
    if (!newTeam.players?.includes(entityPlayerId)) return;

    setNewTeam({
      ...newTeam,
      captain: newTeam.captain === entityPlayerId ? undefined : entityPlayerId,
      viceCaptain: newTeam.viceCaptain === entityPlayerId ? undefined : newTeam.viceCaptain
    });
  };

  const handleViceCaptainSelect = (entityPlayerId: number) => {
    if (!newTeam.players?.includes(entityPlayerId)) return;

    setNewTeam({
      ...newTeam,
      viceCaptain: newTeam.viceCaptain === entityPlayerId ? undefined : entityPlayerId,
      captain: newTeam.captain === entityPlayerId ? undefined : newTeam.captain
    });
  };

  // Group players by role
  const getPlayersByRole = (role: string) => {
    const allPlayers: MatchPlayer[] = [];
    playersData.forEach(teamData => {
      teamData.playersList.forEach(player => {
        allPlayers.push({
          ...player,
          teamName: teamData.teamName,
          teamAbbr: teamData.teamAbbr
        } as MatchPlayer);
      });
    });

    const filteredPlayers = allPlayers.filter(p => p.playing_role.toLowerCase() === role.toLowerCase());
    
    // Sort: Playing XI first, then others
    return filteredPlayers.sort((a, b) => {
      if (a.isPlayingEleven && !b.isPlayingEleven) return -1;
      if (!a.isPlayingEleven && b.isPlayingEleven) return 1;
      return 0;
    });
  };

  const getPlayerName = (entityPlayerId: number): string => {
    for (const teamData of playersData) {
      const player = teamData.playersList.find(p => p.entityPlayerId === entityPlayerId);
      if (player) return player.name;
    }
    return 'Unknown';
  };

  const getSelectedCountByRole = (role: string): number => {
    if (!newTeam.players || newTeam.players.length === 0) return 0;
    
    let count = 0;
    for (const entityPlayerId of newTeam.players) {
      for (const teamData of playersData) {
        const player = teamData.playersList.find(p => p.entityPlayerId === entityPlayerId);
        if (player && player.playing_role.toLowerCase() === role.toLowerCase()) {
          count++;
          break;
        }
      }
    }
    return count;
  };

  const isMatchStarted = room ? new Date(room.startTime) <= new Date() : false;
  const isDeadlinePassed = room ? new Date(room.endTime) <= new Date() : false;
  const canAddTeam = room && !isDeadlinePassed;

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white p-3 pt-16 sm:pt-20 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Card className="bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 mb-8">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-10 w-48" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pt-16 sm:pt-20 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Room not found</div>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    const shareData = {
      title: "Check out this room!",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <>
      <Head>
        <title>{room.name} - Sapna 11</title>
        <meta property="og:title" content={`${room.name} - Sapna 11`} />
        <meta property="og:description" content={`Join the ${room.name} fantasy cricket league! Build your team and compete with friends.`} />
        <meta property="og:url" content={`https://sapna11.vercel.app/rooms/${params.id}`} />
        <meta name="twitter:title" content={`${room.name} - Sapna 11`} />
        <meta name="twitter:description" content={`Join the ${room.name} fantasy cricket league! Build your team and compete with friends.`} />
      </Head>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white p-3 pt-16 sm:pt-20 sm:p-8">
        <div className="max-w-4xl mx-auto pt-4 sm:pt-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white ">
              {room.name}
            </h1>
            {new Date() >= new Date(room.endTime) ? (
              <Link href={`/rooms/${params.id}/match-center`}>
                <Button className="bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900">
                  Match Center
                </Button>
              </Link>
            ) : canAddTeam && !showAddTeam ? (
              <Button
                onClick={() => setShowAddTeam(true)}
                className="bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Team
              </Button>
          ) : null}
        </div>

        {!isDeadlinePassed &&<Card className="bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 mb-8">
          <CardContent className="p-3 sm:p-6 text-neutral-900 dark:text-white">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
                <span className="text-neutral-400">Match Start:</span>
                <span className="text-neutral-900 dark:text-white">
                  {new Date(room.startTime).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-400" />
                <span className="text-neutral-400">Team Selection Deadline:</span>
                <span className="text-neutral-900 dark:text-white">
                  {new Date(room.endTime).toLocaleString()}
                </span>
              </div>
            </div>
            {isDeadlinePassed && (
              <div className="mt-4 p-3 bg-red-900/30 rounded-lg flex gap-2 text-red-400 text-sm sm:text-base">
                <AlertTriangle className="h-5 w-5" />
                Team selection is closed. The deadline has passed.
              </div>
            )}
            {!isMatchStarted && !isDeadlinePassed && (
              <div className="mt-4 p-3 bg-neutral-200 dark:bg-neutral-800 rounded-lg flex gap-2 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base">
                <Clock className="h-5 w-5" />
                Match hasn't started yet. Create your team before the deadline!
              </div>
            )}

            <Button onClick={handleShare} className="mt-2 flex items-center gap-2 bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900">
              <Share2 className="w-4 h-4" />
              Share link with friends
            </Button>
          </CardContent>
        </Card>}

        {showAddTeam && (
          <Card className="bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 mb-8">
            <CardHeader className='pb-0 sm:pb-0'>
              <CardTitle className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                Add New Team
              </CardTitle>
            </CardHeader>
            <CardContent className='text-neutral-900 dark:text-white'>
              <form onSubmit={handleAddTeam} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="teamName">Team Name</Label>
                  <Input
                    id="teamName"
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                    className="bg-white dark:bg-neutral-950 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Select Players (11)</Label>
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-neutral-200 dark:bg-neutral-900">
                      <TabsTrigger value="all" className="data-[state=active]:bg-neutral-900 dark:data-[state=active]:bg-neutral-100 data-[state=active]:text-white dark:data-[state=active]:text-neutral-900">
                        ALL ({getSelectedCountByRole('all')})
                      </TabsTrigger>
                      <TabsTrigger value="bat" className="data-[state=active]:bg-neutral-900 dark:data-[state=active]:bg-neutral-100 data-[state=active]:text-white dark:data-[state=active]:text-neutral-900">
                        BAT ({getSelectedCountByRole('bat')})
                      </TabsTrigger>
                      <TabsTrigger value="bowl" className="data-[state=active]:bg-neutral-900 dark:data-[state=active]:bg-neutral-100 data-[state=active]:text-white dark:data-[state=active]:text-neutral-900">
                        BOWL ({getSelectedCountByRole('bowl')})
                      </TabsTrigger>
                      <TabsTrigger value="wk" className="data-[state=active]:bg-neutral-900 dark:data-[state=active]:bg-neutral-100 data-[state=active]:text-white dark:data-[state=active]:text-neutral-900">
                        WK ({getSelectedCountByRole('wk')})
                      </TabsTrigger>
                    </TabsList>
                    
                    {['all', 'bat', 'bowl', 'wk'].map(role => (
                      <TabsContent key={role} value={role} className="mt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
                          {getPlayersByRole(role).map((player) => {
                            const isSelected = newTeam.players?.includes(player.entityPlayerId);
                            const isCaptain = newTeam.captain === player.entityPlayerId;
                            const isViceCaptain = newTeam.viceCaptain === player.entityPlayerId;

                            return (
                              <div
                                key={player.entityPlayerId}
                                className={`p-3 rounded-lg border transition-all cursor-pointer flex justify-between ${
                                  isSelected
                                    ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-400 dark:border-neutral-600'
                                    : 'bg-white dark:bg-neutral-950 border-neutral-300 dark:border-neutral-700'
                                }`}
                                onClick={() => handlePlayerSelect(player.entityPlayerId)}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="font-medium text-neutral-900 dark:text-white mb-1">{player.name}</div>
                                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 font-[family-name:var(--font-geist-mono)]">
                                      <span>{player.teamAbbr} • {player.playing_role.toUpperCase()} {player.role}</span>
                                      {player.isPlayingEleven && (
                                        <Badge variant="outline" className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-600 dark:border-green-600">
                                          XI
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {isSelected && (
                                  <div className="flex gap-2 mt-2">
                                    <Button
                                      size="sm"
                                      type="button"
                                      variant={isCaptain ? "default" : "outline"}
                                      className={`flex-1 ${
                                        isCaptain
                                          ? 'bg-yellow-500 hover:bg-yellow-600'
                                          : 'bg-neutral-200 dark:bg-neutral-950 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-800'
                                      }`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCaptainSelect(player.entityPlayerId);
                                      }}
                                    >
                                      C
                                    </Button>
                                    <Button
                                      size="sm"
                                      type="button"
                                      variant={isViceCaptain ? "default" : "outline"}
                                      className={`flex-1 ${
                                        isViceCaptain
                                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                          : 'bg-neutral-200 dark:bg-neutral-950 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-800'
                                      }`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleViceCaptainSelect(player.entityPlayerId);
                                      }}
                                    >
                                      VC
                                    </Button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                  <div className="mt-4 flex items-center gap-2 text-sm text-neutral-900 dark:text-white flex-wrap">
                    <Badge variant="outline" className={`p-2 py-1 rounded-md text-neutral-900 dark:text-white border-neutral-300 dark:border-neutral-700 ${newTeam.players?.length === 11 ? 'bg-green-200 dark:bg-green-700' : ''}`}>
                      {newTeam.players?.length || 0}/11 Selected
                    </Badge>
                    {newTeam.captain && (
                      <Badge variant="outline" className="p-2 py-1 text-white bg-yellow-600 rounded-md border-yellow-700">
                        Captain: {getPlayerName(newTeam.captain)}
                      </Badge>
                    )}
                    {newTeam.viceCaptain && (
                      <Badge variant="outline" className="p-2 py-1 text-white bg-blue-600 rounded-md border-blue-700">
                        Vice Captain: {getPlayerName(newTeam.viceCaptain)}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900"
                    disabled={
                      !newTeam.name ||
                      !newTeam.captain ||
                      !newTeam.viceCaptain ||
                      (newTeam.players?.length || 0) !== 11
                    }
                  >
                    Add Team
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowAddTeam(false)}
                    className="flex-1 bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6">
          {teams.length > 0 && (
            <Scores teams={teams} slug={room.slug} playersData={playersData} startTime={room.startTime} endTime={room.endTime} roomId={params.id} />
          )}
        </div>
      </div>
    </div>
    </>
  );
}