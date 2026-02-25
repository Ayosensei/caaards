export interface Deck {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface FlashCard {
  id: string;
  deckId: string;
  question: string;
  answer: string;
  category?: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: string;
  lastReviewDate?: string;
}

export type Rating = 0 | 1 | 2 | 3 | 4 | 5;

export interface StudySession {
  deckId: string;
  cardId: string;
  rating: Rating;
  reviewedAt: string;
}
