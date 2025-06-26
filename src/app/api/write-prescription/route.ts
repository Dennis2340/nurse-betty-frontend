/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

const STORAGE_DIR = path.join(process.cwd(), 'storage');
const PENDING_DIR = path.join(STORAGE_DIR, 'pending_prescriptions');

// async function ensureStorageDir() {
//   try {
//     await fs.mkdir(STORAGE_DIR, { recursive: true });
//   } catch (err) {
//     console.error('Could not create storage directory:', err);
//   }
// }

async function savePendingPrescription(data: unknown) {
  await fs.mkdir(PENDING_DIR, { recursive: true });
  const filePath = path.join(PENDING_DIR, `pending_${Date.now()}.json`);
  await fs.writeFile(filePath, JSON.stringify(data));
}

const schema = z.object({
  patientId: z.string(),
  medications: z.array(z.string()),
  dosage: z.string(),
  needsModeration: z.boolean().default(false).describe('Flag for human review'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { patientId, medications, dosage, needsModeration } = schema.parse(body);

    const result = {
      patientId,
      medications,
      dosage,
      needsModeration,
      timestamp: new Date().toISOString(),
    };

    if (needsModeration) {
      await savePendingPrescription(result);
      return NextResponse.json({ ...result, status: 'pending_moderation' });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in write-prescription:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}