"use client";

import { useState, useCallback } from "react";
import { FlashCard, Rating } from "@/types/flashcard";
import * as storage from "@/lib/storage";
import { calculateNextReview } from "@/lib/spacedRepetition";

export function useCards(deckId?: string) {
  const getInitialCards = () => {
    if (typeof window === "undefined") return [];
    return deckId ? storage.getCardsByDeck(deckId) : storage.getAllCards();
  };

  const [cards, setCards] = useState<FlashCard[]>(getInitialCards);

  const loadCards = useCallback(() => {
    const data = deckId ? storage.getCardsByDeck(deckId) : storage.getAllCards();
    setCards(data);
  }, [deckId]);

  const createCard = useCallback(
    (question: string, answer: string, category?: string) => {
      if (!deckId) throw new Error("deckId is required");
      const newCard = storage.createCard(deckId, question, answer, category);
      setCards((prev) => [...prev, newCard]);
      return newCard;
    },
    [deckId]
  );

  const updateCard = useCallback(
    (id: string, updates: Partial<Omit<FlashCard, "id" | "deckId">>) => {
      const updated = storage.updateCard(id, updates);
      if (updated) {
        setCards((prev) => prev.map((c) => (c.id === id ? updated : c)));
      }
      return updated;
    },
    []
  );

  const deleteCard = useCallback((id: string) => {
    const success = storage.deleteCard(id);
    if (success) {
      setCards((prev) => prev.filter((c) => c.id !== id));
    }
    return success;
  }, []);

  const reviewCard = useCallback((id: string, rating: Rating) => {
    const card = storage.getCard(id);
    if (!card) return null;

    const result = calculateNextReview(card, rating);
    const updated = storage.updateCard(id, result);
    if (updated) {
      setCards((prev) => prev.map((c) => (c.id === id ? updated : c)));
    }
    return updated;
  }, []);

  const getCard = useCallback((id: string) => {
    return storage.getCard(id);
  }, []);

  const getDueCards = useCallback(() => {
    return storage.getDueCards(deckId);
  }, [deckId]);

  return {
    cards,
    loading: false,
    createCard,
    updateCard,
    deleteCard,
    reviewCard,
    getCard,
    getDueCards,
    refresh: loadCards,
  };
}
