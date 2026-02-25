"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { FlashCard, Rating } from "@/types/flashcard";
import { getCardsByDeck, getDeck, updateCard } from "@/lib/storage";
import FlashCardSession from "@/components/FlashCardSession";

export default function StudyDeckPage() {
  const params = useParams();
  const router = useRouter();
  const [dueCards, setDueCards] = useState<FlashCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [deckName, setDeckName] = useState("");

  useEffect(() => {
    const deck = getDeck(params.deckId as string);
    if (deck) {
      setDeckName(deck.name);
      const cards = getCardsByDeck(params.deckId as string);
      const now = new Date().toISOString();
      const due = cards.filter((c) => c.nextReviewDate <= now);
      setDueCards(due);
    }
    setLoading(false);
  }, [params.deckId]);

  const handleReview = useCallback((cardId: string, rating: Rating) => {
    const card = dueCards.find((c) => c.id === cardId);
    if (card) {
      import("@/lib/spacedRepetition").then(({ calculateNextReview }) => {
        const result = calculateNextReview(card, rating);
        updateCard(cardId, result);
      });
    }
  }, [dueCards]);

  const handleComplete = useCallback(() => {
    router.push("/decks");
  }, [router]);

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
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={`/decks/${params.deckId}`}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
          >
            ← Back
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Study: {deckName}
          </h1>
        </div>

        <FlashCardSession
          cards={dueCards}
          onReview={handleReview}
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
}
