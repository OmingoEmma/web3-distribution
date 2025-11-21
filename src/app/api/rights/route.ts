import { NextResponse } from 'next/server';
import { mockRights } from '@/data/mockData';

export async function GET() {
  return NextResponse.json(mockRights);
}


