"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import Link from "next/link";
import { getOverallStats } from "@/lib/storage";

export default function HomePage() {
  const [stats, setStats] = useState(() => {
    if (typeof window === "undefined") {
      return { totalDecks: 0, totalCards: 0, dueCards: 0, masteredCards: 0 };
    }
    return getOverallStats();
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStats(getOverallStats());
  }, []); // eslint-disable-line react-hooks/set-state-in-effect

  const hasData = stats.totalDecks > 0 || stats.totalCards > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Caaards
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Master your knowledge with spaced repetition
          </p>
        </div>

        {!hasData ? (
          <div className="text-center max-w-md mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
              <div className="text-6xl mb-4">🎴</div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Welcome to Caaards!
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Get started by creating your first deck and adding flashcards.
              </p>
              <Link
                href="/decks/new"
                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-full hover:shadow-lg transition-all hover:scale-105"
              >
                Create Your First Deck
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-3xl mx-auto">
              <StatCard
                label="Decks"
                value={stats.totalDecks}
                icon="📁"
                color="text-blue-500"
              />
              <StatCard
                label="Total Cards"
                value={stats.totalCards}
                icon="🎴"
                color="text-purple-500"
              />
              <StatCard
                label="Due Today"
                value={stats.dueCards}
                icon="📚"
                color="text-orange-500"
              />
              <StatCard
                label="Mastered"
                value={stats.masteredCards}
                icon="⭐"
                color="text-green-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {stats.dueCards > 0 ? (
                <Link
                  href="/study"
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-full hover:shadow-lg transition-all hover:scale-105 text-center"
                >
                  Study Now ({stats.dueCards} due)
                </Link>
              ) : (
                <div className="px-8 py-4 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold rounded-full text-center">
                  No cards due
                </div>
              )}
              <Link
                href="/decks"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-full hover:shadow-lg transition-all hover:scale-105 text-center"
              >
                Manage Decks
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: string;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
    </div>
  );
}
