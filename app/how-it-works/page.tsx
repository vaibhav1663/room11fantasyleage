"use client";

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Users, Trophy, BarChart3, Share2 } from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      icon: Users,
      title: "Create a Room",
      description: "Start by creating a private room for an upcoming cricket match. Choose the match, set the team selection deadline, and get a unique room link.",
    },
    {
      icon: Share2,
      title: "Invite Friends",
      description: "Share the room link with your friends. They can join and create their own fantasy teams before the deadline.",
    },
    {
      icon: Trophy,
      title: "Build Your Team",
      description: "Select 11 players from both teams. Choose your captain (2x points) and vice-captain (1.5x points) wisely. Pick players across different roles: batsmen, bowlers, wicket-keepers, and all-rounders.",
    },
    {
      icon: BarChart3,
      title: "Track Performance",
      description: "Once the match starts, track real-time player performances and see how your team ranks against your friends. Points are awarded based on runs, wickets, catches, and more.",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <main className="pt-16 sm:pt-20 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white font-[family-name:var(--font-geist-mono)] mb-4">
              HOW IT WORKS?
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Get started with Sapna 11 in four simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {steps.map((step, index) => (
              <Card key={index} className="bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800">
                <CardHeader className='p-3 sm:p-4 pb-0 sm:pb-0'>
                  <div className="flex items-start gap-4">
                    <div className="bg-neutral-900 dark:bg-neutral-100 p-3 rounded-lg">
                      <step.icon className="w-6 h-6 text-white dark:text-neutral-900" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-[family-name:var(--font-geist-mono)] text-neutral-600 dark:text-neutral-400">
                          STEP {index + 1}
                        </span>
                      </div>
                      <CardTitle className="text-xl font-bold text-neutral-900 dark:text-white">
                        {step.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-4">
                  <p className="text-neutral-600 dark:text-neutral-400 text-base leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
              Ready to start?
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Create your first room and invite your friends to compete in fantasy cricket.
            </p>
            <Link
              href="/rooms/create"
              className="inline-flex items-center gap-2 bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 px-6 py-3 rounded-md transition-colors font-medium"
            >
              Create a Room
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
