import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import staticCache from '../../data/live_cache.json';

export const dynamic = 'force-dynamic'; // Always fetch fresh data

export async function GET() {
  try {
    // 1. Try to fetch from Vercel KV (Redis)
    const liveData = await kv.get('live_cache');

    // 2. If Redis has data, return it.
    if (liveData) {
      return NextResponse.json(liveData);
    }

    // 3. If Redis is empty (first run), return static backup
    return NextResponse.json(staticCache);

  } catch (error) {
    console.error("KV Read Error:", error);
    // 4. Fail safe: return static backup
    return NextResponse.json(staticCache);
  }
}
