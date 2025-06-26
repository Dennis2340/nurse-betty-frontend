/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getEmbedding } from '@/lib/openai';
import { pineconeIndex } from '@/lib/pinecone';

const schema = z.object({
  query: z.string().describe('The patient\'s input or question'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query } = schema.parse(body);

    const embedding = await getEmbedding(query);
    const results = await pineconeIndex.query({
      vector: embedding,
      topK: 5,
      includeMetadata: true,
    });

    console.log('Guideline retrieval results:', results);
    return NextResponse.json(
      results.matches.map((match: any) => ({
        text: match.metadata.text,
        section: match.metadata.source_section,
        category: match.metadata.category,
        entity: match.metadata.entity,
        severity_level: match.metadata.severity_level,
      })),
    );
  } catch (error:any) {
    console.error('Error in retrieve-guideline:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}