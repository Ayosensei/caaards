import FlashCardSession from "@/components/FlashCardSession";
import { sampleFlashcards } from "@/data/flashcards";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Caaards
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Master your knowledge, one card at a time
          </p>
        </div>

        {/* Flashcard Session */}
        <FlashCardSession cards={sampleFlashcards} />
      </main>
    </div>
  );
}
