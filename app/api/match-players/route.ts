import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://apis.fancraze.com/v1_3/getMatchPlayersTeamwise?slug=${slug}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch match players');
    }
    
    const data = await response.json();
    
    // Return the data in the expected format
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching match players:', error);
    return NextResponse.json({ error: 'Error fetching match players' }, { status: 500 });
  }
}