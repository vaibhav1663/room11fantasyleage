"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Room, MatchPlayer, Team } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Trophy, Star, Clock, AlertTriangle, Share2 } from "lucide-react";
import Link from 'next/link';
import Scores from '@/components/scores';

export default function RoomPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<MatchPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [newTeam, setNewTeam] = useState<Partial<Team>>({
    name: '',
    captain: '',
    viceCaptain: '',
    players: []
  });

  useEffect(() => {
    Promise.all([
      fetch(`/api/rooms/${params.id}`).then(res => res.json()),
      fetch(`/api/match-players?slug=${room?.slug || ''}`).then(res => res.json())
    ]).then(([roomData, playersData]) => {
      setRoom(roomData);
      setPlayers(Object.values(playersData.data));
      setLoading(false);
    }).catch(error => {
      console.error('Error fetching data:', error);
      setLoading(false);
    });
  }, [params.id, room?.slug]);

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!room) return;

    try {
      const response = await fetch(`/api/rooms/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...room,
          teams: [...room.teams, newTeam]
        }),
      });

      if (!response.ok) throw new Error('Failed to add team');

      const updatedRoom = await response.json();
      setRoom(updatedRoom);
      setShowAddTeam(false);
      setNewTeam({
        name: '',
        captain: '',
        viceCaptain: '',
        players: []
      });
    } catch (error) {
      console.error('Error adding team:', error);
    }
  };

  const handlePlayerSelect = (playerName: string) => {
    if (!newTeam.players) return;

    if (newTeam.players.includes(playerName)) {
      setNewTeam({
        ...newTeam,
        players: newTeam.players.filter(p => p !== playerName),
        captain: newTeam.captain === playerName ? '' : newTeam.captain,
        viceCaptain: newTeam.viceCaptain === playerName ? '' : newTeam.viceCaptain
      });
    } else if (newTeam.players.length < 11) {
      setNewTeam({
        ...newTeam,
        players: [...newTeam.players, playerName]
      });
    }
  };

  const handleCaptainSelect = (playerName: string) => {
    if (!newTeam.players?.includes(playerName)) return;

    setNewTeam({
      ...newTeam,
      captain: newTeam.captain === playerName ? '' : playerName,
      viceCaptain: newTeam.viceCaptain === playerName ? '' : newTeam.viceCaptain
    });
  };

  const handleViceCaptainSelect = (playerName: string) => {
    if (!newTeam.players?.includes(playerName)) return;

    setNewTeam({
      ...newTeam,
      viceCaptain: newTeam.viceCaptain === playerName ? '' : playerName,
      captain: newTeam.captain === playerName ? '' : newTeam.captain
    });
  };

  const isMatchStarted = room ? new Date(room.startTime) <= new Date() : false;
  const isDeadlinePassed = room ? new Date(room.endTime) <= new Date() : false;
  const canAddTeam = room && !isDeadlinePassed;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Loading room...</div>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-3 pt-6 sm:p-8 text-white">
      <div className="max-w-4xl mx-auto">
        <Link href="/rooms" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Rooms
        </Link>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            {room.name}
          </h1>
          {canAddTeam && !showAddTeam && (
            <Button
              onClick={() => setShowAddTeam(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Team
            </Button>
          )}
        </div>

        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardContent className="pt-3 sm:pt-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-400" />
                <span className="text-gray-400">Match Start:</span>
                <span className="text-white">
                  {new Date(room.startTime).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-400" />
                <span className="text-gray-400">Team Selection Deadline:</span>
                <span className="text-white">
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
              <div className="mt-4 p-3 bg-purple-900/30 rounded-lg flex gap-2 text-purple-400 text-sm sm:text-base">
                <Clock className="h-5 w-5" />
                Match hasn't started yet. Create your team before the deadline!
              </div>
            )}

            <Button onClick={handleShare} variant="outline" className="mt-2 flex items-center gap-2 text-white hover:text-white bg-purple-700 hover:bg-purple-600 border-purple-600">
              <Share2 className="w-4 h-4" />
              Share link with friends
            </Button>
          </CardContent>
        </Card>

        {showAddTeam && (
          <Card className="bg-gray-800 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">
                Add New Team
              </CardTitle>
            </CardHeader>
            <CardContent className='text-white'>
              <form onSubmit={handleAddTeam} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="teamName">Team Name</Label>
                  <Input
                    id="teamName"
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Select Players (11)</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {players.map((player) => {
                      const isSelected = newTeam.players?.includes(player.name);
                      const isCaptain = newTeam.captain === player.name;
                      const isViceCaptain = newTeam.viceCaptain === player.name;

                      return (
                        <div
                          key={player.playerId}
                          className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${isSelected
                            ? 'bg-purple-900/50 border-purple-500'
                            : 'bg-gray-900/50 border-gray-700 '
                            }`}
                          onClick={() => {
                            handlePlayerSelect(player.name)
                          }
                          }
                        >
                          <div className="flex items-center justify-between mb-2 w-full" >
                            <div
                            >
                              <span className="font-medium">{player.name}</span>
                              <div className="text-sm text-gray-400">
                                {player.teamName} • {player.playingRole}
                              </div>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                type='button'
                                variant={isCaptain ? "default" : "outline"}
                                className={`flex-1 bg-gray-800 border-gray-700 ${isCaptain
                                  ? 'bg-yellow-500 hover:bg-yellow-600'
                                  : 'hover:bg-gray-700'
                                  }`}
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent parent div click event
                                  handleCaptainSelect(player.name)
                                }}
                              >
                                C
                              </Button>
                              <Button
                                size="sm"
                                type='button'
                                variant={isViceCaptain ? "default" : "outline"}
                                className={`flex-1 bg-gray-800 border-gray-700 text-sm ${isViceCaptain
                                  ? 'bg-purple-600 hover:bg-purple-700'
                                  : 'hover:bg-gray-700'
                                  }`}
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent parent div click event
                                  handleViceCaptainSelect(player.name)
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
                  <div className="mt-4 flex items-center gap-2 text-sm text-white">
                    <Badge variant="outline" className={`p-2 py-1 rounded-md text-white border-gray-700 ${newTeam.players?.length === 11 ? 'bg-green-700' : ''}`}>{newTeam.players?.length || 0}/11 Selected</Badge>
                    {newTeam.captain && (
                      <Badge variant="outline" className="p-2 py-1 text-white bg-yellow-600 rounded-md border-gray-700">Captain: {newTeam.captain}</Badge>
                    )}
                    {newTeam.viceCaptain && (
                      <Badge variant="outline" className="p-2 py-1 text-white bg-purple-600 rounded-md border-gray-700">Vice Captain: {newTeam.viceCaptain}</Badge>
                    )}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
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
                    className="flex-1 bg-gray-700 hover:bg-gray-600"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6">
          {room.teams.length > 0 && (
            <Scores teams={room.teams} />
          )}
            
        </div>
      </div>
    </div>
  );
}