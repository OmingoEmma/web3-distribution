import { NextResponse } from 'next/server';
import { mockUsers } from '@/data/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role');
  const email = searchParams.get('email');

  let filteredUsers = mockUsers;

  // Filter by role if provided
  if (role) {
    filteredUsers = filteredUsers.filter(u => u.role === role);
  }

  // Filter by email if provided
  if (email) {
    filteredUsers = filteredUsers.filter(u => u.email === email);
  }

  return NextResponse.json(filteredUsers);
}


