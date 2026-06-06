import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, { cache: 'no-store' });
    const data = await response.json();

    console.log('Frontend health ping result:', data);

    return NextResponse.json({
      success: true,
      backend: data,
      apiBaseUrl: API_BASE_URL,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Frontend health ping failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Unable to reach backend health endpoint',
        details: String(error),
        apiBaseUrl: API_BASE_URL,
      },
      { status: 502 }
    );
  }
}
