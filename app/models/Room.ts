import mongoose from 'mongoose';
import { truncate } from 'node:fs';

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  captain: { type: String, required: true },
  viceCaptain: { type: String, required: true },
  players: [{ type: String, required: true }]
});

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  teams: [teamSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Room || mongoose.model('Room', roomSchema);