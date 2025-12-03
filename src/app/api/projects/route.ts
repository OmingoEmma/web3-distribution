import { NextResponse } from 'next/server';
import { mockProjects } from '@/data/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const userEmail = searchParams.get('userEmail');

  let filteredProjects = mockProjects;

  // Filter by user if userId or userEmail is provided
  if (userId || userEmail) {
    filteredProjects = mockProjects.filter(project =>
      project.contributors.some(c => 
        (userId && c.id === userId) || (userEmail && c.email === userEmail)
      )
    );
  }

  return NextResponse.json(filteredProjects);
}


