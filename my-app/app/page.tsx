"use client";

import { useState, KeyboardEvent } from "react";

const TARGET_WORD = "30212575"; // change to any word, any length, any characters

type TileState = "green" | "yellow" | "gray";

/**
 * Wordle-accurate evaluation:
 * - Greens first (exact matches)
 * - Yellows only if remaining letters exist
 */
function evaluateGuess(guess: string, target: string): TileState[] {
  const result: TileState[] = Array(target.length).fill("gray");
  const targetCounts: Record<string, number> = {};

  // Count target letters
  for (const char of target) {
    targetCounts[char] = (targetCounts[char] || 0) + 1;
  }

  // First pass: greens
  for (let i = 0; i < target.length; i++) {
    if (guess[i] === target[i]) {
      result[i] = "green";
      targetCounts[guess[i]]--;
    }
  }

  // Second pass: yellows
  for (let i = 0; i < target.length; i++) {
    const char = guess[i];
    if (result[i] === "gray" && targetCounts[char] > 0) {
      result[i] = "yellow";
      targetCounts[char]--;
    }
  }

  return result;
}

export default function Codele() {
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");

  const wordLength = TARGET_WORD.length;
  const solved = guesses.includes(TARGET_WORD);

  function submitGuess() {
    if (!currentGuess || solved) return;

    setGuesses((prev) => [...prev, currentGuess]);
    setCurrentGuess("");
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      submitGuess();
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4">
      {/* Title */}
      <h1 className="mt-8 mb-6 text-4xl font-bold tracking-wide">
        Codele
      </h1>

      {/* Board */}
      <div className="space-y-3 w-full max-w-md">
        {/* Locked guesses */}
        {guesses.map((guess, rowIndex) => {
          const evaluation = evaluateGuess(guess, TARGET_WORD);

          return (
            <div
              key={rowIndex}
              className="grid gap-2"
              style={{ gridTemplateColumns: `repeat(${wordLength}, 1fr)` }}
            >
              {[...Array(wordLength)].map((_, colIndex) => {
                const char = guess[colIndex];
                const state = evaluation[colIndex];

                const color =
                  state === "green"
                    ? "bg-green-600 border-green-600"
                    : state === "yellow"
                    ? "bg-yellow-500 border-yellow-500"
                    : "bg-neutral-600 border-neutral-600";

                return (
                  <div
                    key={colIndex}
                    className={`aspect-square flex items-center justify-center text-lg font-semibold uppercase border rounded ${color}`}
                  >
                    {char}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Active row (only one visible) */}
        {!solved && (
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${wordLength}, 1fr)` }}
          >
            {[...Array(wordLength)].map((_, colIndex) => (
              <div
                key={colIndex}
                className="aspect-square flex items-center justify-center text-lg font-semibold uppercase border rounded
                  bg-neutral-900 border-neutral-700"
              >
                {currentGuess[colIndex]}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      {!solved && (
        <input
          value={currentGuess}
          onChange={(e) => setCurrentGuess(e.target.value)}
          onKeyDown={onKeyDown}
          className="mt-6 w-full max-w-md px-4 py-3 rounded bg-neutral-900 border border-neutral-700 text-center text-lg tracking-widest uppercase"
          placeholder="Type anything and press Enter"
          autoFocus
        />
      )}

      {/* Solved message */}
      {solved && (
        <p className="mt-6 text-lg text-green-500 font-semibold">
          Merry Christmas!
        </p>
      )}
    </main>
  );
}
