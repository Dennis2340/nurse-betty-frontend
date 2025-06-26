/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  prescriptionId: z.string(),
  reason: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prescriptionId, reason } = schema.parse(body);

    return NextResponse.json({
      prescriptionId,
      status: 'pending',
      message: `Sent for review: ${reason}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in flag-for-moderation:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}