import { NextResponse } from 'next/server';
import { mockRights } from '@/data/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const status = searchParams.get('status');

  let filteredRights = mockRights;

  // Filter by user if userId is provided
  if (userId) {
    filteredRights = filteredRights.filter(r => r.ownerId === userId);
  }

  // Filter by status if provided
  if (status) {
    filteredRights = filteredRights.filter(r => r.status === status);
  }

  return NextResponse.json(filteredRights);
}


