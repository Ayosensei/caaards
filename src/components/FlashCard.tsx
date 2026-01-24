"use client";

interface FlashCardProps {
  question: string;
  answer: string;
  isFlipped: boolean;
  onFlip: () => void;
}

export default function FlashCard({ question, answer, isFlipped, onFlip }: FlashCardProps) {
  return (
    <div className="perspective-1000 w-full max-w-2xl mx-auto">
      <div
        onClick={onFlip}
        className={`relative w-full h-80 cursor-pointer transition-transform duration-600 transform-style-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front Side - Question */}
        <div
          className="absolute w-full h-full backface-hidden bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-2xl p-8 flex items-center justify-center"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div className="text-center">
            <div className="text-sm font-semibold text-white/80 mb-4 uppercase tracking-wide">
              Question
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white leading-relaxed">
              {question}
            </p>
            <div className="mt-6 text-sm text-white/70">
              Click to reveal answer
            </div>
          </div>
        </div>

        {/* Back Side - Answer */}
        <div
          className="absolute w-full h-full backface-hidden bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-2xl p-8 flex items-center justify-center"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="text-center">
            <div className="text-sm font-semibold text-white/80 mb-4 uppercase tracking-wide">
              Answer
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white leading-relaxed">
              {answer}
            </p>
            <div className="mt-6 text-sm text-white/70">
              Click to see question
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
