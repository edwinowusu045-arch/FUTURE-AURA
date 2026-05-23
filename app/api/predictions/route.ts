import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const samplePredictions = [
  { id: 'sample-1', metric: 'Revenue', value: 1200000, horizon: 'Annual', generatedAt: new Date().toISOString() },
  { id: 'sample-2', metric: 'Revenue', value: 110000, horizon: 'Monthly', generatedAt: new Date().toISOString() },
  { id: 'sample-3', metric: 'Gross Margin', value: 48.2, horizon: 'Annual', generatedAt: new Date().toISOString() }
];

export async function GET() {
  try {
    const predictions = await prisma.prediction.findMany({
      orderBy: { generatedAt: 'desc' },
      take: 10,
      select: {
        id: true,
        metric: true,
        value: true,
        horizon: true,
        generatedAt: true
      }
    });

    return NextResponse.json({ data: predictions });
  } catch (error) {
    return NextResponse.json({ data: samplePredictions });
  }
}
