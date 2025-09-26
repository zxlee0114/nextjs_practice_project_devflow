import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextResponse } from "next/server";
import z from "zod";

import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import { AIAnswerSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";

export async function POST(request: Request) {
  const { title: question, content, userAnswer } = await request.json();

  try {
    const validatedData = AIAnswerSchema.safeParse({ question, content });
    if (!validatedData.success) {
      const flattenError = z.flattenError(validatedData.error);
      throw new ValidationError(flattenError.fieldErrors);
    }

    const { text } = await generateText({
      model: openai("gpt-4-turbo"),
      prompt: `Generate a markdown-formatted response to the following question: "${question}".

      Consider the provided context:
      **Context:** ${content}

      Also, prioritize and incorporate the user's answer when formulating your response:
      **User's Answer:** ${userAnswer}

      Prioritize the user's answer only if it's correct. If it's incomplete or incorrect, improve or correct it while keeping the response concise and to the point.
      Provide the final answer in markdown format.`,
      system:
        "You are a helpful assistant that provides informative responses in markdown format. Use appropriate markdown syntax for headings, lists, code blocks, and emphasis where necessary. For code blocks, use short-form smaller case language identifiers (e.g., 'js' for JavaScript, 'py' for Python, 'ts' for TypeScript, 'html' for HTML, 'css' for CSS, etc.).",
    });

    return NextResponse.json({ success: true, data: text }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
