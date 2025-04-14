import mongoose, { Document, Schema } from 'mongoose';

export interface IPlaylist extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  description: string;
  songs: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const playlistSchema: Schema<IPlaylist> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    songs: {
      type: [{ type: mongoose.Types.ObjectId, ref: 'Song' }],
      required: true,
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Tạo model từ schema
const Playlist = mongoose.model<IPlaylist>('Playlist', playlistSchema);
export default Playlist;
