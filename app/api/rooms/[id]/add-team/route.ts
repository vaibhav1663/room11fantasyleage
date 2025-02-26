import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Room from '@/app/models/Room';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const body = await request.json(); // Expecting the new team data

        const room = await Room.findByIdAndUpdate(
            params.id,
            { $push: { teams: body } }, // Push new team to the teams array
            { new: true }
        );

        if (!room) {
            return NextResponse.json({ error: 'Room not found' }, { status: 404 });
        }

        return NextResponse.json(room);
    } catch (error) {
        return NextResponse.json({ error: 'Error updating room' }, { status: 500 });
    }
}
