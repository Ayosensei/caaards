"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FlashCard, Rating } from "@/types/flashcard";
import { getDueCards, updateCard } from "@/lib/storage";
import FlashCardSession from "@/components/FlashCardSession";

export default function StudyPage() {
  const router = useRouter();
  const [dueCards, setDueCards] = useState<FlashCard[]>(() => {
    if (typeof window === "undefined") return [];
    return getDueCards();
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDueCards(getDueCards());
  }, []);

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
    router.push("/");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
          >
            ← Back
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Study All Due Cards
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
