"use client"

import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
      <div className="max-w-4xl mx-auto px-2 sm:px-0">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="text-lg font-semibold text-neutral-900 dark:text-white hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors font-[family-name:var(--font-geist-mono)] flex items-center gap-2">
            SAPNA 11
            <span className="text-xs px-1.5 py-0.5 bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded">BETA</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/how-it-works" className="text-sm text-neutral-900 dark:text-white hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors hidden sm:block mr-1">
              How it Works? 
            </Link>
            <Link href="/rooms" className="text-sm bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 px-4 py-2 rounded-md transition-colors">
              Explore Rooms
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}
