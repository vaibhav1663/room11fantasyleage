import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Room from '@/app/models/Room';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    console.log('Creating room:', body);
    const room = await Room.create(body);
    console.log('Room created:', room);
    return NextResponse.json(room);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error creating room' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    const [rooms, total] = await Promise.all([
      Room.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Room.countDocuments({})
    ]);
    
    return NextResponse.json({
      rooms,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + rooms.length < total
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching rooms' }, { status: 500 });
  }
}