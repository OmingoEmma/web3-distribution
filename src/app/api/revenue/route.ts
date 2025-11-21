import { NextResponse } from 'next/server';
import { mockRevenue } from '@/data/mockData';

export async function GET() {
  return NextResponse.json(mockRevenue);
}


