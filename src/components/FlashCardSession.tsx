"use client";

import { useState, useEffect, useCallback } from "react";
import { FlashCard as FlashCardType } from "@/types/flashcard";
import FlashCard from "./FlashCard";
import ProgressBar from "./ProgressBar";

interface FlashCardSessionProps {
  cards: FlashCardType[];
}

export default function FlashCardSession({ cards }: FlashCardSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const currentCard = cards[currentIndex];
  const isFirstCard = currentIndex === 0;
  const isLastCard = currentIndex === cards.length - 1;

  const handleNext = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, cards.length]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsComplete(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && !isLastCard) {
        handleNext();
      } else if (e.key === "ArrowLeft" && !isFirstCard) {
        handlePrevious();
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleFlip();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleNext, handlePrevious, handleFlip, isFirstCard, isLastCard]);

  if (isComplete) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-2xl p-12">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Session Complete!
          </h2>
          <p className="text-xl text-white/90 mb-8">
            You&apos;ve reviewed all {cards.length} flashcards.
          </p>
          <button
            onClick={handleRestart}
            className="px-8 py-4 bg-white text-green-600 font-semibold rounded-full hover:bg-gray-100 transition-colors shadow-lg"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Progress Bar */}
      <ProgressBar current={currentIndex + 1} total={cards.length} />

      {/* Flashcard */}
      <div className="mb-8">
        <FlashCard
          question={currentCard.question}
          answer={currentCard.answer}
          isFlipped={isFlipped}
          onFlip={handleFlip}
        />
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center items-center gap-4">
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
          Use arrow keys to navigate • Space to flip
        </div>

        <button
          onClick={handleNext}
          disabled={isLastCard}
          className={`px-6 py-3 rounded-full font-semibold transition-all ${
            isLastCard
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:scale-105"
          }`}
        >
          Next →
        </button>
      </div>

      {/* Category Badge */}
      {currentCard.category && (
        <div className="text-center mt-6">
          <span className="inline-block px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
            {currentCard.category}
          </span>
        </div>
      )}
    </div>
  );
}
