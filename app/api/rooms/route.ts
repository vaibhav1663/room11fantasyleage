import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Room from '@/app/models/Room';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const room = await Room.create(body);
    return NextResponse.json(room);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating room' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const rooms = await Room.find({}).sort({ createdAt: -1 });
    return NextResponse.json(rooms);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching rooms' }, { status: 500 });
  }
}