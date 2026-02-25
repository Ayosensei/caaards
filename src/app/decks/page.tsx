"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useDecks } from "@/hooks/useDecks";
import { getDeckStats } from "@/lib/storage";

export default function DecksPage() {
  const { decks, loading, deleteDeck, refresh } = useDecks();
  const [deckStats, setDeckStats] = useState<Record<string, { totalCards: number; dueCards: number; masteredCards: number }>>({});

  useEffect(() => {
    const stats: Record<string, { totalCards: number; dueCards: number; masteredCards: number }> = {};
    decks.forEach((deck) => {
      stats[deck.id] = getDeckStats(deck.id);
    });
    setDeckStats(stats);
  }, [decks]);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"? All cards in this deck will also be deleted.`)) {
      deleteDeck(id);
      refresh();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
        <div className="container mx-auto px-4 py-12">
          <p className="text-center text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Your Decks</h1>
          <Link
            href="/decks/new"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
          >
            + New Deck
          </Link>
        </div>

        {decks.length === 0 ? (
          <div className="text-center max-w-md mx-auto">
            <div className="text-6xl mb-4">📁</div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              No decks yet
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Create your first deck to start adding flashcards.
            </p>
            <Link
              href="/decks/new"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg"
            >
              Create Deck
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {decks.map((deck) => {
              const stats = deckStats[deck.id] || { totalCards: 0, dueCards: 0, masteredCards: 0 };
              return (
                <div
                  key={deck.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                        {deck.name}
                      </h3>
                      <div className="flex gap-2">
                        <Link
                          href={`/decks/${deck.id}/edit`}
                          className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          ✏️
                        </Link>
                        <button
                          onClick={() => handleDelete(deck.id, deck.name)}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    {deck.description && (
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                        {deck.description}
                      </p>
                    )}
                    <div className="grid grid-cols-3 gap-2 text-center mb-4">
                      <div>
                        <div className="text-lg font-bold text-purple-600">{stats.totalCards}</div>
                        <div className="text-xs text-gray-500">Total</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-orange-500">{stats.dueCards}</div>
                        <div className="text-xs text-gray-500">Due</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-500">{stats.masteredCards}</div>
                        <div className="text-xs text-gray-500">Mastered</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/decks/${deck.id}`}
                        className="flex-1 px-4 py-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-center rounded-lg text-sm font-medium hover:bg-indigo-200 dark:hover:bg-indigo-800"
                      >
                        View Cards
                      </Link>
                      {stats.dueCards > 0 && (
                        <Link
                          href={`/study/${deck.id}`}
                          className="flex-1 px-4 py-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 text-center rounded-lg text-sm font-medium hover:bg-green-200 dark:hover:bg-green-800"
                        >
                          Study
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
