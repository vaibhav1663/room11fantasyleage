import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Index for efficient queries
roomSchema.index({ createdAt: -1 });

export default mongoose.models.Room1 || mongoose.model('Room1', roomSchema);