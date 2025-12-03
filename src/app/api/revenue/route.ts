import { NextResponse } from 'next/server';
import { mockRevenue } from '@/data/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const status = searchParams.get('status');

  let filteredRevenue = mockRevenue;

  // Filter by user if userId is provided
  if (userId) {
    filteredRevenue = filteredRevenue.filter(r => r.contributorId === userId);
  }

  // Filter by status if provided
  if (status) {
    filteredRevenue = filteredRevenue.filter(r => r.status === status);
  }

  return NextResponse.json(filteredRevenue);
}


