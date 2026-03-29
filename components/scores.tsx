'use client';
import { Player, Team, TeamData } from '@/app/types';
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Medal, Star, Trophy } from 'lucide-react';

const Scores = ({ teams, slug, playersData }: { teams: Team[], slug: string, playersData: TeamData[] }) => {
    const [playerData, setPlayerData] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFantasyPoints = async () => {
        try {
            const res = await fetch(`https://apis.fancraze.com/challenge3/challenge/V3/getFantasyPointLeaderboard?slug=${slug}`);
            const data = await res.json();

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
    }, [slug]);

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

    const calculateTeamPoints = (team: Team) => {
        let totalPoints = 0;
        if (team.players.length > 0 && playerData.length > 0) {
            team.players.forEach(entityPlayerId => {
                const player = findLeaderboardPlayer(entityPlayerId);
                if (player) {
                    let points = parseFloat(player.rawPoints);

                    // Double points for captain, 1.5x for vice captain
                    if (entityPlayerId === team.captain) {
                        points *= 2;
                    } else if (entityPlayerId === team.viceCaptain) {
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
            <div className="text-center text-neutral-900 dark:text-white p-8">
                Loading fantasy scores...
            </div>
        );
    }

    const rankings = getTeamRankings();

    return (
        <div className="flex gap-4 mb-8 sm:flex-row flex-col-reverse">
            {/* Main Team Details Section */}
            <div className="flex-1 grid gap-6">
                {rankings.map((team, index) => (
                    <Card key={team.name} className={`bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-700 transform transition-all`}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-4">
                            <CardTitle className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                                {index === 0 && <Trophy className="h-6 w-6 text-yellow-500" />}
                                {index === 1 && <Medal className="h-6 w-6 text-neutral-400" />}
                                {index === 2 && <Medal className="h-6 w-6 text-amber-600" />}
                                {team.name}
                            </CardTitle>
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {team.points.toFixed(2)} pts
                            </div>
                        </CardHeader>
                        <CardContent className='p-3 pt-2 sm:p-4'>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <Star className="h-5 w-5 text-yellow-500" />
                                    <span className="text-neutral-600 dark:text-neutral-400">Captain:</span>
                                    <span className="text-neutral-900 dark:text-white">{getPlayerName(team.captain)}</span>
                                    <span className="text-sm text-yellow-600 dark:text-yellow-500">
                                        ({getPlayerPoints(team.captain, true, false).raw} × 2 = {getPlayerPoints(team.captain, true, false).multiplied})
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="h-5 w-5 text-purple-500" />
                                    <span className="text-neutral-600 dark:text-neutral-400">Vice Captain:</span>
                                    <span className="text-neutral-900 dark:text-white">{getPlayerName(team.viceCaptain)}</span>
                                    <span className="text-sm text-purple-600 dark:text-purple-500">
                                        ({getPlayerPoints(team.viceCaptain, false, true).raw} × 1.5 = {getPlayerPoints(team.viceCaptain, false, true).multiplied})
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Team Players:</div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {team.players.map(entityPlayerId => {
                                        const isCaptain = entityPlayerId === team.captain;
                                        const isViceCaptain = entityPlayerId === team.viceCaptain;
                                        const points = getPlayerPoints(entityPlayerId, isCaptain, isViceCaptain);
                                        const playerName = getPlayerName(entityPlayerId);
                                        return (
                                            <div key={entityPlayerId} className="flex items-center justify-between text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-900/50 p-2 px-3 rounded">
                                                <span>{playerName}</span>
                                                <span className={`text-sm ${isCaptain ? 'text-yellow-600 dark:text-yellow-500' :
                                                    isViceCaptain ? 'text-purple-600 dark:text-purple-500' :
                                                        'text-neutral-600 dark:text-neutral-400'
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

            {/* Rankings Section */}
            <div className="w-full lg:w-64 block">
                <CardContent className="p-0 sm:p-0 flex flex-col gap-2">
                    {rankings.slice(0, 5).map((team, index) => (
                        <Card
                            key={team.name}
                            className={`flex items-center gap-4 p-4 sm:p-4 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-400/10 last:border-b-0 ${index === 0 ? 'bg-yellow-100 dark:bg-yellow-500/10' :
                                    index === 1 ? 'bg-neutral-100 dark:bg-neutral-400/10' :
                                        index === 2 ? 'bg-amber-100 dark:bg-amber-600/10' : ''
                                }`}
                        >
                            <div className="relative flex items-center justify-center overflow-visible" style={{ width: '35px' }}>
                                <span
                                    className="font-black text-transparent bg-clip-text bg-gradient-to-b from-neutral-400 to-neutral-600 dark:from-[#E2E2E2] dark:to-[#6B6B6B] select-none leading-none"
                                    style={{
                                        fontSize: '50px',
                                        WebkitTextStroke: '1px rgba(0, 0, 0, 0.1)',
                                    }}
                                >
                                    {index + 1}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-neutral-900 dark:text-white font-semibold truncate">{team.name}</div>
                                <div className="text-purple-600 dark:text-purple-400 text-sm font-bold">{team.points.toFixed(2)} pts</div>
                            </div>
                        </Card>
                    ))}
                    <div className="text-center text-sm text-neutral-400 dark:text-neutral-500">
                        ...
                    </div>
                    
                </CardContent>

            </div>
        </div>
    );
}

export default Scores