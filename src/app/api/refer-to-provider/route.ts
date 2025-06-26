/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  patientId: z.string().describe('Unique patient identifier'),
  specialty: z.string().describe('Medical specialty required'),
  urgency: z.enum(['routine', 'urgent', 'emergency']).describe('Referral urgency level'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { patientId, specialty, urgency } = schema.parse(body);

    return NextResponse.json({
      patientId,  
      success: true,
      referralId: `ref_${Date.now()}`,
      provider: 'Dr. Smith at City Medical Center',
      contact: '+1234567890',
      message: `Referred to ${specialty} specialist (${urgency} priority)`,
    });
  } catch (error:any) {
    console.error('Error in refer-to-provider:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}