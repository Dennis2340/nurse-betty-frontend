/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  patientId: z.string().describe('Unique patient identifier'),
  tests: z.array(z.string()).describe('List of required lab tests'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { patientId, tests } = schema.parse(body);

    return NextResponse.json({
      patientId,
      success: true,
      orderId: `lab_${Date.now()}`,
      tests,
      message: 'Lab order created successfully. Patient can schedule tests.',
    });
  } catch (error: any) {
    console.error('Error in generate-lab-order:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}