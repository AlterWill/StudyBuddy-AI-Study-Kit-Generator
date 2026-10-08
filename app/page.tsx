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
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const generateKit = async () => {
    if (!notes.trim()) {
      setError('Please enter some notes before generating a study kit.');
      return;
    }

    setLoading(true);
    setError(null);
    setFlashcardStates([]);
    setQuizIndex(0);
    setSelectedOption(null);
    setScore(0);
    setQuizFinished(false);

    try {
      const res = await fetch('/api/generate-kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: notes }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || 'Failed to generate study kit.');
        return;
      }

      const data = (await res.json()) as StudyKitResponse;
      setKit(data);

      // Initialize flashcard states
      const fcStates = (data.flashcards || []).map((fc) => ({
        question: fc.question,
        answer: fc.answer,
        revealed: false,
      }));
      setFlashcardStates(fcStates);
    } catch {
      setError('Failed to generate study kit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: 'summary' | 'key-concepts' | 'flashcards' | 'quiz') => {
    setActiveTab(tab);
    if (tab === 'quiz') {
      setQuizIndex(0);
      setSelectedOption(null);
      setScore(0);
      setQuizFinished(false);
    }
  };

  const handleSelectOption = (idx: number, correctAnswer: number) => {
    if (selectedOption !== null || !kit) return;
    setSelectedOption(idx);
    const isCorrect = idx === correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (!kit) return;
    if (quizIndex + 1 < kit.quiz.length) {
      setQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setQuizIndex(0);
    setSelectedOption(null);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans text-zinc-900 dark:text-zinc-100">
      <header className="border-b bg-white dark:bg-zinc-800 px-6 py-4 flex items-center justify-between shadow-sm">
        <h1 className="text-2xl font-bold text-black dark:text-zinc-100">StudyBuddy</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
          ForgeHacks 2026 | AI + Education Track
        </p>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {/* Input section */}
        <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-5 mb-6 bg-white dark:bg-zinc-800 shadow-sm">
          <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
            Your Study Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste or type your study notes, lecture excerpts, or articles here..."
            rows={5}
            className="w-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-md border border-zinc-300 dark:border-zinc-700 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          {error && (
            <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-md flex items-center justify-between">
              <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-xs text-red-700 dark:text-red-300 underline font-medium"
              >
                Dismiss
              </button>
            </div>
          )}
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={generateKit}
              disabled={loading}
              className={`inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium text-white transition-colors shadow-sm ${
                loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Generating Study Kit...</span>
                </div>
              ) : (
                'Generate Study Kit'
              )}
            </button>
          </div>
        </div>

        {/* Study Kit tabs */}
        {kit && (
          <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-6 bg-white dark:bg-zinc-800 shadow-sm">
            <div className="flex border-b border-zinc-200 dark:border-zinc-700 pb-2 mb-6 gap-2">
              <button
                onClick={() => handleTabChange('summary')}
                className={`flex-1 py-2 text-sm font-semibold text-center transition-colors rounded-t-md ${
                  activeTab === 'summary'
                    ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                Summary
              </button>
              <button
                onClick={() => handleTabChange('key-concepts')}
                className={`flex-1 py-2 text-sm font-semibold text-center transition-colors rounded-t-md ${
                  activeTab === 'key-concepts'
                    ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                Key Concepts ({kit.keyConcepts?.length || 0})
              </button>
              <button
                onClick={() => handleTabChange('flashcards')}
                className={`flex-1 py-2 text-sm font-semibold text-center transition-colors rounded-t-md ${
                  activeTab === 'flashcards'
                    ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                Flashcards ({flashcardStates.length})
              </button>
              <button
                onClick={() => handleTabChange('quiz')}
                className={`flex-1 py-2 text-sm font-semibold text-center transition-colors rounded-t-md ${
                  activeTab === 'quiz'
                    ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                Quiz ({kit.quiz?.length || 0})
              </button>
            </div>

            {/* Summary Tab */}
            {activeTab === 'summary' && (
              <div className="space-y-4">
                <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <p className="leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
                    {kit.summary}
                  </p>
                </div>
              </div>
            )}

            {/* Key Concepts Tab */}
            {activeTab === 'key-concepts' && (
              <div className="space-y-3">
                {kit.keyConcepts?.map((concept, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700"
                  >
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">{concept}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Flashcards Tab */}
            {activeTab === 'flashcards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {flashcardStates.map((fc, i) => (
                  <div
                    key={i}
                    onClick={() =>
                      setFlashcardStates((prev) =>
                        prev.map((f, idx) => (idx === i ? { ...f, revealed: !f.revealed } : f))
                      )
                    }
                    className={`p-5 rounded-lg border cursor-pointer transition-all min-h-[140px] flex flex-col justify-between ${
                      fc.revealed
                        ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800'
                        : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                        {fc.revealed ? 'Answer' : 'Question'}
                      </p>
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">
                        {fc.revealed ? fc.answer : fc.question}
                      </p>
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-3 self-end font-medium">
                      {fc.revealed ? 'Click to flip to question' : 'Click to reveal answer'}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Quiz Tab */}
            {activeTab === 'quiz' && kit.quiz && kit.quiz.length > 0 && (
              <div>
                {quizFinished ? (
                  <div className="p-6 rounded-lg bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900 text-center space-y-4">
                    <h3 className="text-xl font-bold text-green-900 dark:text-green-200">
                      Quiz Complete!
                    </h3>
                    <p className="text-lg text-green-800 dark:text-green-300">
                      You scored <span className="font-bold">{score}</span> out of{' '}
                      <span className="font-bold">{kit.quiz.length}</span>
                    </p>
                    <button
                      onClick={handleRestartQuiz}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition"
                    >
                      Retake Quiz
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                        Question {quizIndex + 1} of {kit.quiz.length}
                      </p>
                      <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                        Score: {score}
                      </p>
                    </div>

                    <p className="text-base font-medium text-zinc-900 dark:text-zinc-100 mb-5">
                      {kit.quiz[quizIndex]?.question}
                    </p>

                    <div className="space-y-2 mb-6">
                      {kit.quiz[quizIndex]?.options.map((option, i) => {
                        const isSelected = selectedOption === i;
                        const isCorrect = i === kit.quiz[quizIndex].correctAnswer;
                        const hasAnswered = selectedOption !== null;

                        let buttonStyles =
                          'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800';

                        if (hasAnswered) {
                          if (isCorrect) {
                            buttonStyles =
                              'bg-green-100 dark:bg-green-950/60 border-green-500 text-green-900 dark:text-green-200 font-medium';
                          } else if (isSelected) {
                            buttonStyles =
                              'bg-red-100 dark:bg-red-950/60 border-red-500 text-red-900 dark:text-red-200';
                          } else {
                            buttonStyles = 'opacity-50 border-zinc-200 dark:border-zinc-700';
                          }
                        }

                        return (
                          <button
                            key={i}
                            disabled={hasAnswered}
                            onClick={() =>
                              handleSelectOption(i, kit.quiz[quizIndex].correctAnswer)
                            }
                            className={`w-full p-3.5 rounded-lg border text-left text-sm transition flex items-center justify-between ${buttonStyles}`}
                          >
                            <span>{option}</span>
                            {hasAnswered && isCorrect && (
                              <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                            )}
                            {hasAnswered && isSelected && !isCorrect && (
                              <span className="text-red-600 dark:text-red-400 font-bold">✗</span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {selectedOption !== null && (
                      <button
                        onClick={handleNextQuestion}
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition float-right"
                      >
                        {quizIndex + 1 < kit.quiz.length ? 'Next Question' : 'Finish Quiz'}
                      </button>
                    )}
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