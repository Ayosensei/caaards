"use client";

import { useState, useEffect, useCallback } from "react";
import { FlashCard as FlashCardType, Rating } from "@/types/flashcard";
import FlashCard from "./FlashCard";
import ProgressBar from "./ProgressBar";
import { getRatingColor, calculateNextReview, getNextReviewText } from "@/lib/spacedRepetition";

interface FlashCardSessionProps {
  cards: FlashCardType[];
  onComplete?: () => void;
  onReview?: (cardId: string, rating: Rating) => void;
}

export default function FlashCardSession({ cards, onComplete, onReview }: FlashCardSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [reviewedCards, setReviewedCards] = useState<Set<string>>(new Set());

  const currentCard = cards[currentIndex];
  const isFirstCard = currentIndex === 0;
  const isLastCard = currentIndex === cards.length - 1;

  const handleNext = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentIndex, cards.length, onComplete]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleRating = useCallback((rating: Rating) => {
    if (!currentCard) return;

    setReviewedCards((prev) => new Set(prev).add(currentCard.id));
    onReview?.(currentCard.id, rating);
    handleNext();
  }, [currentCard, onReview, handleNext]);

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsComplete(false);
    setReviewedCards(new Set());
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isComplete) return;

      if (e.key === "ArrowRight" && !isLastCard && !isFlipped) {
        handleNext();
      } else if (e.key === "ArrowLeft" && !isFirstCard && !isFlipped) {
        handlePrevious();
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (!isFlipped) {
          handleFlip();
        }
      } else if (isFlipped) {
        if (e.key === "1") handleRating(0);
        else if (e.key === "2") handleRating(2);
        else if (e.key === "3") handleRating(3);
        else if (e.key === "4") handleRating(4);
        else if (e.key === "5") handleRating(5);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleNext, handlePrevious, handleFlip, handleRating, isFirstCard, isLastCard, isFlipped, isComplete]);

  if (cards.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-2xl p-12">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold text-white mb-4">
            All caught up!
          </h2>
          <p className="text-xl text-white/90 mb-8">
            No cards due for review right now.
          </p>
          <button
            onClick={onComplete}
            className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-full hover:bg-gray-100 transition-colors shadow-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-2xl p-12">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Session Complete!
          </h2>
          <p className="text-xl text-white/90 mb-4">
            You reviewed {reviewedCards.size} card{reviewedCards.size !== 1 ? "s" : ""}.
          </p>
          <p className="text-lg text-white/70 mb-8">
            Great job! Keep up the consistent practice.
          </p>
          <button
            onClick={handleRestart}
            className="px-8 py-4 bg-white text-green-600 font-semibold rounded-full hover:bg-gray-100 transition-colors shadow-lg"
          >
            Study Again
          </button>
        </div>
      </div>
    );
  }

  const ratingButtons: { rating: Rating; label: string; key: string }[] = [
    { rating: 0, label: "Again", key: "1" },
    { rating: 2, label: "Hard", key: "2" },
    { rating: 3, label: "Good", key: "3" },
    { rating: 4, label: "Easy", key: "4" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <ProgressBar current={currentIndex + 1} total={cards.length} />

      <div className="mb-8">
        <FlashCard
          question={currentCard.question}
          answer={currentCard.answer}
          isFlipped={isFlipped}
          onFlip={handleFlip}
        />
      </div>

      {!isFlipped ? (
        <div className="flex justify-center items-center gap-4 mb-4">
          <button
            onClick={handlePrevious}
            disabled={isFirstCard}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              isFirstCard
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:scale-105"
            }`}
          >
            ← Previous
          </button>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            Click card or press Space to reveal
          </div>

          <button
            onClick={handleFlip}
            className="px-6 py-3 rounded-full font-semibold transition-all bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-lg hover:scale-105"
          >
            Show Answer
          </button>
        </div>
      ) : (
        <div className="mb-4">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
            How well did you know this?
          </div>
          <div className="flex justify-center gap-3 flex-wrap">
            {ratingButtons.map(({ rating, label, key }) => (
              <button
                key={rating}
                onClick={() => handleRating(rating)}
                className={`px-6 py-3 rounded-full font-semibold text-white transition-all hover:scale-105 ${getRatingColor(rating)}`}
              >
                {label} ({key})
              </button>
            ))}
          </div>
          {currentCard && (
            <div className="text-center mt-4 text-sm text-gray-500">
              Next review:{" "}
              {getNextReviewText(
                calculateNextReview(currentCard, 3).interval
              )}
            </div>
          )}
        </div>
      )}

      <div className="text-center mt-6">
        <span className="inline-block px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
          Card {currentIndex + 1} of {cards.length}
        </span>
      </div>
    </div>
  );
}
