import { NextResponse } from 'next/server';
import { mockProjects } from '@/data/mockData';

export async function GET() {
  return NextResponse.json(mockProjects);
}


