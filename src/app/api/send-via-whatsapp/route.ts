/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  phoneNumber: z.string().describe('Patient WhatsApp number in E.164 format'),
  message: z.string().describe('Content to send'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phoneNumber, message } = schema.parse(body);

    return NextResponse.json({
      phoneNumber,
      success: true,
      messageId: `wa_${Date.now()}`,
      status: 'sent',
      preview: message.substring(0, 50) + '...',
    });
  } catch (error:any) {
    console.error('Error in send-via-whatsapp:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}