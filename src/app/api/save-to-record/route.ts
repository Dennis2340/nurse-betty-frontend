/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

const STORAGE_DIR = path.join(process.cwd(), 'storage');

async function ensureStorageDir() {
  try {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
  } catch (err) {
    console.error('Could not create storage directory:', err);
  }
}

async function saveDataToFile(type: string, data: object) {
  await ensureStorageDir();
  const filename = `${type}_${Date.now()}.json`;
  const filePath = path.join(STORAGE_DIR, filename);

  await fs.writeFile(filePath, JSON.stringify({
    encrypted: false,
    data,
  }));

  return { success: true, filePath };
}

const schema = z.object({
  type: z.enum(['prescription', 'lab_order', 'referral', 'symptom_check']),
  data: z.object({}).passthrough().strict(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = schema.parse(body);

    const result = await saveDataToFile(type, data);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in save-to-record:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}