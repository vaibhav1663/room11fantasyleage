'use client';
import { Player, Team } from '@/app/types';
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Medal, Star, Trophy } from 'lucide-react';

const Scores = ({ teams, slug }: { teams: Team[], slug: string }) => {
    const [playerData, setPlayerData] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFantasyPoints = async () => {
        try {
            const res = await fetch(`https://apis.fancraze.com/challenge3/challenge/V3/getFantasyPointLeaderboard?slug=${slug}`);
            const data = await res.json();
            console.log(data);

            if (data?.data?.playerList) {
                setPlayerData(data.data.playerList);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFantasyPoints();
        const interval = setInterval(fetchFantasyPoints, 30000);
        return () => clearInterval(interval);
    }, []);

    const getPlayerPoints = (playerName: string, isCaptain: boolean, isViceCaptain: boolean) => {
        const player = playerData.find(p => p.name === playerName);
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

    const calculateTeamPoints = (team: Team) => {
        let totalPoints = 0;
        if (team.players.length > 0 && playerData.length > 0) {
            team.players.forEach(playerName => {
                const player = playerData.find(p => p.name === playerName);
                if (player) {
                    let points = parseFloat(player.rawPoints);

                    // Double points for captain, 1.5x for vice captain
                    if (player.name === team.captain) {
                        points *= 2;
                    } else if (player.name === team.viceCaptain) {
                        points *= 1.5;
                    }

                    totalPoints += points;
                }
            });
        }
        return totalPoints;
    };

    const getTeamRankings = () => {
        return teams
            .map(team => ({
                ...team,
                points: calculateTeamPoints(team)
            }))
            .sort((a, b) => b.points - a.points);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center">
                        Loading fantasy scores...
                    </div>
                </div>
            </div>
        );
    }

    const rankings = getTeamRankings();

    return (
        <div className="grid gap-6 mb-8">
            {rankings.map((team, index) => (
                <Card key={team.name} className={`bg-gray-800 border-gray-700 transform transition-all`}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-6">
                        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                            {index === 0 && <Trophy className="h-6 w-6 text-yellow-500" />}
                            {index === 1 && <Medal className="h-6 w-6 text-gray-400" />}
                            {index === 2 && <Medal className="h-6 w-6 text-amber-600" />}
                            {team.name}
                        </CardTitle>
                        <div className="text-2xl font-bold text-purple-400">
                            {team.points.toFixed(2)} pts
                        </div>
                    </CardHeader>
                    <CardContent className='p-3 pt-2 sm:p-6'>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <Star className="h-5 w-5 text-yellow-500" />
                                <span className="text-gray-400">Captain:</span>
                                <span className="text-white">{team.captain}</span>
                                <span className="text-sm text-yellow-500">
                                    ({getPlayerPoints(team.captain, true, false).raw} × 2 = {getPlayerPoints(team.captain, true, false).multiplied})
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="h-5 w-5 text-purple-500" />
                                <span className="text-gray-400">Vice Captain:</span>
                                <span className="text-white">{team.viceCaptain}</span>
                                <span className="text-sm text-purple-500">
                                    ({getPlayerPoints(team.viceCaptain, false, true).raw} × 1.5 = {getPlayerPoints(team.viceCaptain, false, true).multiplied})
                                </span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="text-sm text-gray-400 mb-2">Team Players:</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {team.players.map(player => {
                                    const isCaptain = player === team.captain;
                                    const isViceCaptain = player === team.viceCaptain;
                                    const points = getPlayerPoints(player, isCaptain, isViceCaptain);
                                    return (
                                        <div key={player} className="flex items-center justify-between text-gray-300 bg-gray-900/50 p-2 px-3 rounded">
                                            <span>{player}</span>
                                            <span className={`text-sm ${isCaptain ? 'text-yellow-500' :
                                                isViceCaptain ? 'text-purple-500' :
                                                    'text-gray-400'
                                                }`}>
                                                {points.raw} {isCaptain ? '× 2' : isViceCaptain ? '× 1.5' : ''} = {points.multiplied}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export default Scores