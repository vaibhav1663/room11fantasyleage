"use client";

import { useState, useEffect } from 'react';
import { Room } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Users } from "lucide-react";
import Link from 'next/link';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/rooms')
      .then(res => res.json())
      .then(data => {
        setRooms(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching rooms:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Loading rooms...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-3 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="pl-2 text-2xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Rooms
          </h1>
          <Link href="/rooms/create">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Room
            </Button>
          </Link>
        </div>

        <div className="grid gap-6">
          {rooms.length === 0 ? (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="text-center text-gray-400">
                  No rooms available. Create one to get started!
                </div>
              </CardContent>
            </Card>
          ) : (
            rooms.map((room) => (
              <Link href={`/rooms/${room._id}`} key={room._id}>
                <Card className="bg-gray-800 border-gray-700 transform transition-all cursor-pointer">
                  <CardHeader className="p-3 sm:p-6 flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                      {room.name}
                    </CardTitle>
                    <div className="text-sm text-gray-400">
                      {room.teams.length} teams
                    </div>
                  </CardHeader>
                  <CardContent className='p-3 sm:p-6 pt-0'>
                    <p className="text-gray-400">Match: {room.slug}</p>
                    <p className="text-sm text-gray-500">
                      Created {new Date(room.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}