"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useDecks } from "@/hooks/useDecks";
import { useCards } from "@/hooks/useCards";

export default function DeckDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getDeck, deleteDeck } = useDecks();
  const { cards, loading, deleteCard, refresh } = useCards(params.id as string);
  const [deck, setDeck] = useState<{ id: string; name: string; description?: string } | null>(() => {
    return getDeck(params.id as string) || null;
  });

  useEffect(() => {
    const d = getDeck(params.id as string);
    if (d) {
      setDeck(d);
    }
  }, [params.id, getDeck]);

  const handleDeleteCard = (id: string, question: string) => {
    if (confirm(`Delete this card?\n\n"${question.substring(0, 50)}..."`)) {
      deleteCard(id);
      refresh();
    }
  };

  const handleDeleteDeck = () => {
    if (deck && confirm(`Delete "${deck.name}" and all its cards?`)) {
      deleteDeck(deck.id);
      router.push("/decks");
    }
  };

  if (!deck) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
        <div className="container mx-auto px-4 py-12">
          <p className="text-center text-gray-600">Deck not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/decks"
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
          >
            ← Back
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex-1">
            {deck.name}
          </h1>
          <button
            onClick={handleDeleteDeck}
            className="px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
          >
            Delete Deck
          </button>
        </div>

        {deck.description && (
          <p className="text-gray-600 dark:text-gray-300 mb-8">{deck.description}</p>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Cards ({cards.length})
          </h2>
          <div className="flex gap-4">
            <Link
              href={`/cards/new?deckId=${deck.id}`}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              + Add Card
            </Link>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-600 dark:text-gray-300">Loading...</p>
        ) : cards.length === 0 ? (
          <div className="text-center max-w-md mx-auto">
            <div className="text-6xl mb-4">🎴</div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              No cards yet
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Add your first flashcard to this deck.
            </p>
            <Link
              href={`/cards/new?deckId=${deck.id}`}
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg"
            >
              Add Card
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {cards.map((card) => (
              <div
                key={card.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex gap-4"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-800 dark:text-white mb-2">
                    Q: {card.question}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                    A: {card.answer}
                  </div>
                  <div className="flex gap-2 text-xs">
                    {card.category && (
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                        {card.category}
                      </span>
                    )}
                    <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded">
                      Due: {card.nextReviewDate <= new Date().toISOString() ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Link
                    href={`/cards/${card.id}/edit?deckId=${deck.id}`}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    ✏️
                  </Link>
                  <button
                    onClick={() => handleDeleteCard(card.id, card.question)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
