/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { OpenAI } from 'openai';

const client = new OpenAI({
  baseURL: 'https://router.huggingface.co/featherless-ai/v1',
  apiKey: process.env.HF_TOKEN,
});

const schema = z.object({
  task: z.enum(['extract_symptoms', 'generate_question']).describe('The task to perform'),
  input: z.string().describe('The input text for the task'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { task, input } = schema.parse(body);

    let prompt;
    if (task === 'extract_symptoms') {
      prompt = `Extract the key symptoms from the following patient input: "${input}"`;
    } else if (task === 'generate_question') {
      prompt = `Based on the following guideline context and the patient's symptoms, what is the next best question to ask to gather more information?\nGuideline context: ${input}`;
    } else {
      throw new Error('Invalid task type');
    }

    const chatCompletion = await client.chat.completions.create({
      model: 'Intelligent-Internet/II-Medical-8B-1706',
      messages: [{ role: 'user', content: prompt }],
    });

    console.log('Medical model response:', chatCompletion.choices[0].message.content);
    return NextResponse.json(chatCompletion.choices[0].message.content);
  } catch (error:any) {
    console.error('Error in medical-model-query:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}