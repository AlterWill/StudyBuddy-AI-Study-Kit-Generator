import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || text.trim() === '') {
      return NextResponse.json({ error: 'Please provide notes text.' }, { status: 400 });
    }

    // Force structured JSON output for easy frontend rendering
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are StudyBuddy. Analyze these notes and generate a study kit in JSON format with these exact keys:
      - "summary": a 2-3 sentence summary
      - "keyConcepts": array of important points
      - "flashcards": array of objects with "question" and "answer"
      - "quiz": array of objects with "question", "options" (array of 4 strings), and "correctAnswer" (0-indexed integer)

      Notes content:
      ${text}`,
      config: {
        responseMimeType: 'application/json',
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
      },
    });

    const kitData = JSON.parse(response.text ?? '{}');
    return NextResponse.json(kitData);
  } catch (error) {
    console.error('Error generating study kit:', error);
    return NextResponse.json({ error: 'Failed to generate study kit.' }, { status: 500 });
  }
}
