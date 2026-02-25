import { FlashCard, Rating } from "@/types/flashcard";

export interface ReviewResult {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: string;
  lastReviewDate: string;
}

export function calculateNextReview(card: FlashCard, rating: Rating): ReviewResult {
  const now = new Date();
  let { easeFactor, interval, repetitions } = card;

  if (rating < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  easeFactor = easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const nextReviewDate = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);

  return {
    easeFactor,
    interval,
    repetitions,
    nextReviewDate: nextReviewDate.toISOString(),
    lastReviewDate: now.toISOString(),
  };
}

export function getRatingLabel(rating: Rating): string {
  const labels: Record<Rating, string> = {
    0: "Again",
    1: "Again",
    2: "Hard",
    3: "Good",
    4: "Easy",
    5: "Easy",
  };
  return labels[rating];
}

export function getRatingColor(rating: Rating): string {
  const colors: Record<Rating, string> = {
    0: "bg-red-500 hover:bg-red-600",
    1: "bg-red-500 hover:bg-red-600",
    2: "bg-orange-500 hover:bg-orange-600",
    3: "bg-green-500 hover:bg-green-600",
    4: "bg-blue-500 hover:bg-blue-600",
    5: "bg-purple-500 hover:bg-purple-600",
  };
  return colors[rating];
}

export function getNextReviewText(interval: number): string {
  if (interval === 0) return "Now";
  if (interval === 1) return "1 day";
  if (interval < 7) return `${interval} days`;
  if (interval < 30) return `${Math.round(interval / 7)} weeks`;
  if (interval < 365) return `${Math.round(interval / 30)} months`;
  return `${Math.round(interval / 365)} years`;
}
