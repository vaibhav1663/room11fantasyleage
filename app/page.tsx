"use client";

import Link from 'next/link';
import { Navbar } from '@/components/navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Navbar />
      
      <main className="min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 dark:text-white font-[family-name:var(--font-geist-mono)]">
                SAPNA 11
              </h1>
              <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Build fantasy cricket teams, compete with friends in private leagues, and track real-time player performances.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/rooms/create"
                className="bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 h-10 rounded-md px-6 flex items-center justify-center text-base font-medium transition-colors"
              >
                Create a Room
              </Link>
              <Link
                href="https://github.com/vaibhav1663"
                target="_blank"
                className="bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white h-10 rounded-md px-6 flex items-center justify-center text-base font-medium transition-colors"
              >
                Developer
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}