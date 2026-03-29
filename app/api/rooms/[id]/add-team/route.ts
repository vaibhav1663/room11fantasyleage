import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Room from '@/app/models/Room';
import Team from '@/app/models/Team';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const body = await request.json();

        // Verify room exists
        const room = await Room.findById(params.id);
        if (!room) {
            return NextResponse.json({ error: 'Room not found' }, { status: 404 });
        }

        // Create new team with roomId reference
        const newTeam = await Team.create({
            roomId: params.id,
            name: body.name,
            captain: body.captain, // entityPlayerId
            viceCaptain: body.viceCaptain, // entityPlayerId
            players: body.players // array of entityPlayerIds
        });

        return NextResponse.json(newTeam);
    } catch (error) {
        console.error('Error creating team:', error);
        return NextResponse.json({ error: 'Error creating team' }, { status: 500 });
    }
}

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        // Get all teams for this room
        const teams = await Team.find({ roomId: params.id }).sort({ createdAt: -1 });

        return NextResponse.json(teams);
    } catch (error) {
        console.error('Error fetching teams:', error);
        return NextResponse.json({ error: 'Error fetching teams' }, { status: 500 });
    }
}
