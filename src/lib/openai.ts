import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getEmbedding(input: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    input,
    model: 'text-embedding-3-small',
    encoding_format: 'float',
    dimensions: 1024,
  });

  return response.data[0].embedding;
}

export async function generateAnswerStream(question: string, context: string) {
  const response = await openai.chat.completions.create({
    model: 'llama3-70b-8192',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant. Use the context to answer the question, and just send the answer — no extra explanation.',
      },
      {
        role: 'user',
        content: `Context:\n${context}\n\nQuestion: ${question}`,
      },
    ],
  });

  return response; // async iterable!
}

export async function classifyChunk(text: string) {
  const systemPrompt = `You are an API. Only return valid JSON. Do not include markdown, code blocks, or any explanation. 
For each field, always return a string. If you are unsure, use "unknown".`;

  const userPrompt = `
Given the following medical guideline text, extract:
- category (e.g. "paediatrics", "cardiology")
- entity (e.g. "malaria", "hypertension")
- severity_level (if present, e.g. "mild", "moderate", "severe")

Text:
"""${text}"""

Return as JSON.
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0,
  });

  const content = response.choices[0].message.content;
  try {
    const json = JSON.parse(content!);

    // Post-process to ensure all fields are strings and not null/objects
    for (const key of ['category', 'entity', 'severity_level']) {
      if (
        typeof json[key] !== 'string' ||
        json[key] === null ||
        json[key] === undefined
      ) {
        json[key] = 'unknown';
      }
    }

    console.log('Classified chunk:', json);
    return json;
  } catch (err) {
    console.error('Failed to parse JSON from model:', content);
    throw err;
  }
}