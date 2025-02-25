"use client";

import Link from 'next/link';

export default function Home() {

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <header className="z-50 w-full">
        <div className="max-w-4xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="mr-4 flex flex-1 items-center">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="hidden font-bold text-xl sm:inline-block">CricketRoom</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="#features">Features</Link>
              <Link href="#how-it-works">How It Works</Link>
            </nav>
          </div>
          <div className="flex items-center justify-end">
            <Link href={'/rooms'} className="text-white bg-purple-600 hover:bg-purple-700 h-9 rounded-md px-3 flex items-center text-sm">
              Explore Rooms
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-4xl mx-auto w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-6xl/none">
                  Create Your Fantasy Cricket Room
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                  Join friends, compete with players worldwide, and experience the thrill of fantasy cricket like never
                  before.
                </p>
              </div>
              <div className="flex space-x-4">
                <Link href={'/rooms/create'} className="text-white bg-purple-600 hover:bg-purple-700 h-10 rounded-md px-5 flex items-center text-base">
                  Create a room
                </Link>
                <Link
                  href={'https://github.com/vaibhav1663'}
                  target="_blank"
                  className="text-black bg-white hover:bg-gray-200 h-10 rounded-md px-5 flex items-center text-base"
                >
                  Developer
                </Link>
              </div>
            </div>
          </div>
        </section>
        </main>

    </div>
  );
}