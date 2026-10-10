import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const PROMPT_TEMPLATE = (text: string) => `You are StudyBuddy. Analyze these notes and generate a study kit in JSON format with these exact keys:
- "summary": a 2-3 sentence summary
- "keyConcepts": array of important points
- "flashcards": array of objects with "question" and "answer"
- "quiz": array of objects with "question", "options" (array of 4 strings), and "correctAnswer" (0-indexed integer)

Notes content:
${text}`;

async function generateWithFallback(text: string) {
  // Strategy: Try gemini-3.8-flash first (low thinking level).
  // If unavailable (503/high demand) or rate-limited, fallback to gemini-2.5-flash.
  const attempts: Array<{
    model: string;
    config: {
      responseMimeType: string;
      thinkingConfig?: { thinkingLevel?: ThinkingLevel };
    };
  }> = [
    {
      model: 'gemini-3.8-flash',
      config: {
        responseMimeType: 'application/json',
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    },
    {
      model: 'gemini-2.5-flash',
      config: {
        responseMimeType: 'application/json',
      },
    },
  ];

  let lastError: unknown;

  for (const attempt of attempts) {
    // Retry up to 2 times for transient errors
    for (let retry = 0; retry < 2; retry++) {
      try {
        const response = await ai.models.generateContent({
          model: attempt.model,
          contents: PROMPT_TEMPLATE(text),
          config: attempt.config,
        });

        if (response.text) {
          return JSON.parse(response.text);
        }
      } catch (err: any) {
        lastError = err;
        const isTemporary =
          err?.status === 503 ||
          err?.status === 429 ||
          err?.message?.includes('503') ||
          err?.message?.includes('high demand') ||
          err?.message?.includes('RESOURCE_EXHAUSTED');

        console.warn(
          `[generate-kit] Attempt failed for model ${attempt.model} (retry ${retry}):`,
          err?.message || err
        );

        if (isTemporary && retry === 0) {
          // Wait 1 second before retrying the same model
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }

        // If not transient or retries exhausted for this model, switch to fallback model
        break;
      }
    }
  }

  throw lastError;
}

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || text.trim() === '') {
      return NextResponse.json({ error: 'Please provide notes text.' }, { status: 400 });
    }

    const kitData = await generateWithFallback(text);
    return NextResponse.json(kitData);
  } catch (error: any) {
    console.error('Error generating study kit:', error);
    const friendlyMessage =
      error?.status === 503 || error?.message?.includes('503')
        ? 'Gemini servers are currently experiencing high demand. Please try again in a few moments.'
        : 'Failed to generate study kit. Please try again.';

    return NextResponse.json({ error: friendlyMessage }, { status: 500 });
  }
}
