'use client';
import { useEffect, useState } from 'react';
import { Trophy, Loader2, Swords } from 'lucide-react';
import { ScoreCardData } from '@/app/types';
import { Card } from './ui/card';

export function ScoreCard({slug}: {slug: string}) {
    const [data, setData] = useState<ScoreCardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    const fetchScoreCard = async () => {
      try {
        const response = await fetch(
          'https://apis.fancraze.com/challenge3/challenge/V3/getMiniScoreCardBySlug?slug=' + slug
        );
        const json = await response.json();
        if (json.success) {
          setData(json.data);
          setError(null);
        } else {
          setError('Failed to fetch score data');
        }
      } catch (err) {
        setError('Error fetching score data');
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchScoreCard();
      const interval = setInterval(fetchScoreCard, 30000);
      return () => clearInterval(interval);
    }, []);
  
    if (loading) {
      return (
        <div className="flex items-center justify-center p-8">
          Loading scorecard
        </div>
      );
    }
  
    if (error || !data) {
      return (
        <div className="text-red-500 p-4 text-center">
          {error || 'Failed to load scorecard'}
        </div>
      );
    }
  
    return (
      <Card className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-4xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{data.tournament_name}</h2>
              <p className="text-sm opacity-90">{data.title}</p>
            </div>
            <Trophy className="h-6 w-6" />
          </div>
          <div className="mt-2 text-sm bg-white/10 rounded px-2 py-1 inline-block">
            {data.status_str}
          </div>
        </div>
  
        {/* Teams */}
        <div className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between md:space-x-8">
            {/* Team 1 */}
            <div className="flex-1">
              <div className="flex items-center justify-between md:justify-start md:space-x-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={data.team_1.logo_url}
                    alt={data.team_1.name}
                    className="w-16 h-16 object-contain"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{data.team_1.name}</h3>
                    <p className="text-sm text-gray-600">{data.team_1.short_name}</p>
                  </div>
                </div>
                <div className="text-right md:ml-auto">
                  <p className="font-bold text-xl">{data.team_1.scores || '-'}</p>
                  <p className="text-sm text-gray-600">{data.team_1.overs || ''}</p>
                </div>
              </div>
            </div>
  
            {/* VS Divider */}
            <div className="my-4 md:my-0 flex items-center justify-center">
              <div className="hidden md:block border-r border-gray-200 h-20"></div>
              <div className="md:hidden border-t border-gray-200 w-full"></div>
            </div>
  
            {/* Team 2 */}
            <div className="flex-1">
              <div className="flex items-center justify-between md:justify-end md:space-x-4">
                <div className="flex items-center space-x-3 md:order-2">
                  <img
                    src={data.team_2.logo_url}
                    alt={data.team_2.name}
                    className="w-16 h-16 object-contain"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{data.team_2.name}</h3>
                    <p className="text-sm text-gray-600">{data.team_2.short_name}</p>
                  </div>
                </div>
                <div className="text-right md:text-left md:order-1">
                  <p className="font-bold text-xl">{data.team_2.scores || '-'}</p>
                  <p className="text-sm text-gray-600">{data.team_2.overs || ''}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Footer */}
        {(data.toss_result || data.status_note) && (
          <div className="bg-gray-50 p-4 text-sm text-gray-600">
            {data.toss_result && <p>{data.toss_result}</p>}
            {data.status_note && <p>{data.status_note}</p>}
          </div>
        )}
      </Card>
    );
  }