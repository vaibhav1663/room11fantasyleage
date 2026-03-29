"use client";

import { useState, useEffect } from 'react';
import { Room } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Users, ChevronLeft, ChevronRight } from "lucide-react";
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasMore: false
  });

  const fetchRooms = async (page: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/rooms?page=${page}&limit=10`);
      const data = await res.json();
      setRooms(data.rooms);
      setPagination(data.pagination);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms(1);
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchRooms(newPage);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pt-16 sm:pt-20 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-36" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800">
                <CardHeader className="p-3 sm:p-4 pb-0 sm:pb-0">
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-2">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pt-16 sm:pt-20 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-white font-[family-name:var(--font-geist-mono)]">
            ROOMS
          </h1>
          <Link href="/rooms/create">
            <Button className="bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900">
              <Plus className="w-4 h-4 mr-2" />
              Create Room
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {rooms.length === 0 ? (
            <Card className="bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
              <CardContent className="pt-6">
                <div className="text-center text-neutral-500 dark:text-neutral-400">
                  No rooms available. Create one to get started!
                </div>
              </CardContent>
            </Card>
          ) : (
            rooms.map((room) => (
              <Link href={`/rooms/${room._id}`} key={room._id}>
                <Card className="bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all cursor-pointer">
                  <CardHeader className="p-3 sm:p-4 pb-0 sm:pb-0 flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xl sm:text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                      {room.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='p-3 sm:p-4 pt-0'>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 font-[family-name:var(--font-geist-mono)] uppercase mb-1">{room.slug}</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-500 font-[family-name:var(--font-geist-mono)] uppercase">
                      {new Date(room.createdAt).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <span className="text-neutral-600 dark:text-neutral-400">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasMore}
              className="bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-50"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}