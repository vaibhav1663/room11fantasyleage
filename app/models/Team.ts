import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true, index: true },
  name: { type: String, required: true },
  captain: { type: Number, required: true }, // entityPlayerId
  viceCaptain: { type: Number, required: true }, // entityPlayerId
  players: [{ type: Number, required: true }], // array of entityPlayerIds
  createdAt: { type: Date, default: Date.now }
});

// Compound index for efficient queries
teamSchema.index({ roomId: 1, createdAt: -1 });

export default mongoose.models.Team || mongoose.model('Team', teamSchema);
