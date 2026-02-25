"use client";

import { useState, useEffect, useCallback } from "react";
import { Deck } from "@/types/flashcard";
import * as storage from "@/lib/storage";

export function useDecks() {
  const [decks, setDecks] = useState<Deck[]>(() => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem("caaards_decks");
    return data ? JSON.parse(data) : [];
  });
  const [loading, setLoading] = useState(false);

  const loadDecks = useCallback(() => {
    const data = storage.getAllDecks();
    setDecks(data);
  }, []);

  const createDeck = useCallback((name: string, description?: string) => {
    const newDeck = storage.createDeck(name, description);
    setDecks((prev) => [...prev, newDeck]);
    return newDeck;
  }, []);

  const updateDeck = useCallback(
    (id: string, updates: Partial<Omit<Deck, "id" | "createdAt">>) => {
      const updated = storage.updateDeck(id, updates);
      if (updated) {
        setDecks((prev) => prev.map((d) => (d.id === id ? updated : d)));
      }
      return updated;
    },
    []
  );

  const deleteDeck = useCallback((id: string) => {
    const success = storage.deleteDeck(id);
    if (success) {
      setDecks((prev) => prev.filter((d) => d.id !== id));
    }
    return success;
  }, []);

  const getDeck = useCallback((id: string) => {
    return storage.getDeck(id);
  }, []);

  const getDeckStats = useCallback((id: string) => {
    return storage.getDeckStats(id);
  }, []);

  return {
    decks,
    loading,
    createDeck,
    updateDeck,
    deleteDeck,
    getDeck,
    getDeckStats,
    refresh: loadDecks,
  };
}
