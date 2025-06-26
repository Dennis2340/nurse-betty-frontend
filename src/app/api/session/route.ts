import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export async function POST() {
  const sessionId = randomUUID();
  console.log(`New session created: ${sessionId}`);
  return NextResponse.json({ sessionId });
}