'use client';

import { useState } from 'react';

interface StudyKitResponse {
  summary: string;
  keyConcepts: string[];
  flashcards: { question: string; answer: string }[];
  quiz: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

interface FlashcardState {
  question: string;
  answer: string;
  revealed: boolean;
}

export default function Home() {
  const [notes, setNotes] = useState('');
  const [kit, setKit] = useState<StudyKitResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'key-concepts' | 'flashcards' | 'quiz'>('summary');

  const [flashcardStates, setFlashcardStates] = useState<FlashcardState[]>([]);
  const [quizState, setQuizState] = useState({
    currentIndex: 0,
    score: 0,
    answered: new Set<number>(),
    finished: false,
  });

  const generateKit = async () => {
    setLoading(true);
    setError(null);
    setFlashcardStates([]);
    setQuizState({
      currentIndex: 0,
      score: 0,
      answered: new Set(),
      finished: false,
    });

    try {
      const res = await fetch('/api/generate-kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: notes }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || 'Failed to generate study kit.');
        return;
      }

      const data = (await res.json()) as StudyKitResponse;
      setKit(data);

      // Initialize flashcard states
      const fcStates = data.flashcards.map(() => ({ question: fc.question, answer: fc.answer, revealed: false }));
      setFlashcardStates(fcStates);

      // Initialize quiz state
      setQuizState({
        currentIndex: 0,
        score: 0,
        answered: new Set(),
        finished: false,
      });
    } catch {
      setError('Failed to generate study kit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: 'summary' | 'key-concepts' | 'flashcards' | 'quiz') => {
    setActiveTab(tab);

    // Reset quiz when navigating away and back
    if (tab === 'quiz') {
      setQuizState({
        currentIndex: 0,
        score: 0,
        answered: new Set(),
        finished: false,
      });
    }
  };

  const handleExplainSimply = () => {
    // Simple explanation: just re-display the summary in a clearer way
    // Could make another API call, but for MVP we just highlight key sentences
    setActiveTab('summary');
  };

  const handleSelectOption = (index: number) => {
    const { currentIndex, quiz } = quizState;
    const correctAnswer = quiz[currentIndex].correctAnswer;

    // Immediately reveal feedback
    const newQuiz = [...quiz];
    newQuiz[currentIndex].selected = index;
    newQuiz[currentIndex].correct = index === correctAnswer;
    newQuiz[currentIndex].submitted = true;

    setQuizState({
      currentIndex: currentIndex + 1,
      score: quizState.score + (index === correctAnswer ? 1 : 0),
      answered: quizState.answered,
      finished: false,
    });
  };

  if (!notes.trim()) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
        <header className="border-b bg-white dark:bg-zinc-800 px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black dark:text-zinc-100">StudyBuddy</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">ForgeHacks 2026 | AI + Education Track</p>
        </header>
        <main className="p-6">
          <h2 className="text-xl font-medium mb-4 text-zinc-600 dark:text-zinc-400">Turn notes into study kits</h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Enter your notes above to generate a summary, key concepts, flashcards, and a quiz.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <header className="border-b bg-white dark:bg-zinc-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black dark:text-zinc-100">StudyBuddy</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">ForgeHacks 2026 | AI + Education Track</p>
      </header>

      <main className="p-6">
        {/* Input section */}
        <div className="border rounded-lg p-4 mb-6 bg-white dark:bg-zinc-800 shadow-sm">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter your notes here..."
            rows={4}
            className="w-full bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded border p-2 focus:outline-none focus:ring-2 focus:ring-primary"
          ></textarea>
          <div className="mt-3 flex gap-2">
            <button
              onClick={generateKit}
              disabled={loading}
              className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-dark'}`}
            >
              {loading ? (
                <span className="animate-spin h-4 w-4 border-2 border-white-800 border-t-white-100 rounded-full" />
              ) : (
                'Generate Study Kit'
              )}
            </button>
            {error && (
              <button
                onClick={() => setError(null)}
                className="ml-2 text-sm text-red-600 underline cursor-pointer"
              >
                dismiss
              </button>
            )}
          </div>
        </div>

        {/* Study Kit tabs */}
        {kit && (
          <div className="border rounded-lg p-6 mb-6 bg-white dark:bg-zinc-800 shadow-sm">
            <div className="flex border-b pb-2 mb-4">
              <button
                onClick={() => handleTabChange('summary')}
                className={`flex-1 py-2 text-sm font-medium ${activeTab === 'summary' ? 'text-primary border-b-2 border-primary' : 'text-zinc-500 hover:text-primary'}`}
              >
                Summary
              </button>
              <button
                onClick={() => handleTabChange('key-concepts')}
                className={`flex-1 py-2 text-sm font-medium ${activeTab === 'key-concepts' ? 'text-primary border-b-2 border-primary' : 'text-zinc-500 hover:text-primary'}`}
              >
                Key Concepts
              </button>
              <button
                onClick={() => handleTabChange('flashcards')}
                className={`flex-1 py-2 text-sm font-medium ${activeTab === 'flashcards' ? 'text-primary border-b-2 border-primary' : 'text-zinc-500 hover:text-primary'}`}
              >
                Flashcards
              </button>
              <button
                onClick={() => handleTabChange('quiz')}
                className={`flex-1 py-2 text-sm font-medium ${activeTab === 'quiz' ? 'text-primary border-b-2 border-primary' : 'text-zinc-500 hover:text-primary'}`}
              >
                Quiz
              </button>
            </div>

            {/* Summary Tab */}
            {activeTab === 'summary' && (
              <div>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">{kit.summary}</p>
                <button
                  onClick={handleExplainSimply}
                  className="mt-3 text-primary underline cursor-pointer"
                >
                  Explain Simply
                </button>
              </div>
            )}

            {/* Key Concepts Tab */}
            {activeTab === 'key-concepts' && (
              <div>
                {kit.keyConcepts.map((concept, i) => (
                  <div
                    key={i}
                    className="p-3 rounded bg-zinc-50 dark:bg-zinc-700 mb-2"
                  >
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">{concept}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Flashcards Tab */}
            {activeTab === 'flashcards' && (
              <div>
                {flashcardStates.map((fc, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded mb-3 bg-zinc-50 dark:bg-zinc-700 transition-colors ${fc.revealed ? 'bg-primary-100 dark:bg-primary-900' : ''} cursor-pointer`}
                    onClick={() => setFlashcardStates(
                      flashcardStates.map((f, idx) =>
                        idx === i ? { ...f, revealed: !f.revealed } : f
                      )
                    )}
                  >
                    <p className="font-medium text-zinc-800 dark:text-zinc-200">{fc.question}</p>
                    {fc.revealed && (
                      <p className="mt-2 text-zinc-500 dark:text-zinc-300">{fc.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Quiz Tab */}
            {activeTab === 'quiz' && kit.quiz.length > 0 && (
              <div>
                {quizState.finished && (
                  <div className="p-4 rounded bg-green-100 dark:bg-green-900 mb-4 text-center">
                    <p className="font-medium text-green-800 dark:text-green-200">
                      Quiz Complete! Score: {quizState.score}/{quizState.quiz.length}
                    </p>
                  </div>
                )}

                {!quizState.finished && (
                  <div>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                      {`Question ${quizState.currentIndex + 1} of ${quizState.quiz.length}`}
                    </p>

                    <p className="text-zinc-600 dark:text-zinc-400 mb-6">{quizState.quiz[quizState.currentIndex].question}</p>

                    {quizState.quiz[quizState.currentIndex].options.map((option, i) => {
                      const isSelected = quizState.quiz[currentIndex]?.selected === i;
                      const isCorrect = i === quizState.quiz[currentIndex].correctAnswer;
                      const alreadyAnswered = quizState.answered.has(i);

                      const handleClick = () => {
                        if (alreadyAnswered) return;
                        handleSelectOption(i);
                      };

                      const optionColor = isSelected
                        ? isCorrect
                          ? 'bg-green-100 dark:bg-green-900'
                          : 'bg-red-100 dark:bg-red-900'
                        : 'white';

                      const optionTextColor = isSelected
                        ? isCorrect
                          ? 'text-green-800 dark:text-green-200'
                          : 'text-red-800 dark:text-red-200'
                        : 'zinc-800 dark:text-zinc-200';

                      return (
                        <button
                          key={i}
                          onClick={handleClick}
                          className={`w-full py-3 rounded-md text-left mb-2 transition-colors ${alreadyAnswered ? 'opacity-50 cursor-not-allowed' : ''} ${optionColor} dark:text-zinc-200 ${optionTextColor}`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}