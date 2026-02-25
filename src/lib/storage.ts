import { Deck, FlashCard } from "@/types/flashcard";

const DECKS_KEY = "caaards_decks";
const CARDS_KEY = "caaards_cards";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function getAllDecks(): Deck[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(DECKS_KEY);
  return data ? JSON.parse(data) : [];
}

export function getDeck(id: string): Deck | undefined {
  const decks = getAllDecks();
  return decks.find((d) => d.id === id);
}

export function createDeck(name: string, description?: string): Deck {
  const decks = getAllDecks();
  const newDeck: Deck = {
    id: generateId(),
    name,
    description,
    createdAt: new Date().toISOString(),
  };
  decks.push(newDeck);
  localStorage.setItem(DECKS_KEY, JSON.stringify(decks));
  return newDeck;
}

export function updateDeck(id: string, updates: Partial<Omit<Deck, "id" | "createdAt">>): Deck | null {
  const decks = getAllDecks();
  const index = decks.findIndex((d) => d.id === id);
  if (index === -1) return null;
  decks[index] = { ...decks[index], ...updates };
  localStorage.setItem(DECKS_KEY, JSON.stringify(decks));
  return decks[index];
}

export function deleteDeck(id: string): boolean {
  const decks = getAllDecks();
  const filtered = decks.filter((d) => d.id !== id);
  if (filtered.length === decks.length) return false;
  
  localStorage.setItem(DECKS_KEY, JSON.stringify(filtered));
  
  const cards = getAllCards();
  const filteredCards = cards.filter((c) => c.deckId !== id);
  localStorage.setItem(CARDS_KEY, JSON.stringify(filteredCards));
  
  return true;
}

export function getAllCards(): FlashCard[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(CARDS_KEY);
  return data ? JSON.parse(data) : [];
}

export function getCardsByDeck(deckId: string): FlashCard[] {
  const cards = getAllCards();
  return cards.filter((c) => c.deckId === deckId);
}

export function getCard(id: string): FlashCard | undefined {
  const cards = getAllCards();
  return cards.find((c) => c.id === id);
}

export function createCard(
  deckId: string,
  question: string,
  answer: string,
  category?: string
): FlashCard {
  const cards = getAllCards();
  const now = new Date().toISOString();
  const newCard: FlashCard = {
    id: generateId(),
    deckId,
    question,
    answer,
    category,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReviewDate: now,
    lastReviewDate: undefined,
  };
  cards.push(newCard);
  localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
  return newCard;
}

export function updateCard(
  id: string,
  updates: Partial<Omit<FlashCard, "id" | "deckId">>
): FlashCard | null {
  const cards = getAllCards();
  const index = cards.findIndex((c) => c.id === id);
  if (index === -1) return null;
  cards[index] = { ...cards[index], ...updates };
  localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
  return cards[index];
}

export function deleteCard(id: string): boolean {
  const cards = getAllCards();
  const filtered = cards.filter((c) => c.id !== id);
  if (filtered.length === cards.length) return false;
  localStorage.setItem(CARDS_KEY, JSON.stringify(filtered));
  return true;
}

export function getDueCards(deckId?: string): FlashCard[] {
  const cards = deckId ? getCardsByDeck(deckId) : getAllCards();
  const now = new Date().toISOString();
  return cards.filter((c) => c.nextReviewDate <= now);
}

export function getDueCardsCount(deckId?: string): number {
  return getDueCards(deckId).length;
}

export function getTotalCardsCount(deckId?: string): number {
  return deckId ? getCardsByDeck(deckId).length : getAllCards().length;
}

export function getDeckStats(deckId: string): {
  totalCards: number;
  dueCards: number;
  masteredCards: number;
} {
  const cards = getCardsByDeck(deckId);
  const now = new Date().toISOString();
  return {
    totalCards: cards.length,
    dueCards: cards.filter((c) => c.nextReviewDate <= now).length,
    masteredCards: cards.filter((c) => c.repetitions >= 5).length,
  };
}

export function getOverallStats(): {
  totalDecks: number;
  totalCards: number;
  dueCards: number;
  masteredCards: number;
} {
  const decks = getAllDecks();
  const cards = getAllCards();
  const now = new Date().toISOString();
  return {
    totalDecks: decks.length,
    totalCards: cards.length,
    dueCards: cards.filter((c) => c.nextReviewDate <= now).length,
    masteredCards: cards.filter((c) => c.repetitions >= 5).length,
  };
}
