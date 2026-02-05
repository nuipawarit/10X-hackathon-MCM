import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/db/seed';

export async function POST() {
  try {
    await seedDatabase();
    return NextResponse.json({ success: true, message: 'Database reset and seeded' });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: { code: 'SEED_ERROR', message: 'Failed to reset database' } },
      { status: 500 },
    );
  }
}
