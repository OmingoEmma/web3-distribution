import { NextResponse } from 'next/server';
import { mockUsers } from '@/data/mockData';

export async function GET() {
  return NextResponse.json(mockUsers);
}


