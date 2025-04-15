import mongoose, { Document, Schema } from 'mongoose';

// Định nghĩa interface cho Album
export interface IAlbum extends Document {
  title: string;
  artist?: mongoose.Types.ObjectId;
  releaseDate: Date;
  coverAt: string;
  createdAt: Date;
  updatedAt: Date;
  songs: mongoose.Types.ObjectId[];
}

const albumSchema: Schema<IAlbum> = new Schema(
  {
    title: { type: String, required: true },
    artist: { type: mongoose.Types.ObjectId, required: true, ref: 'MusicalArtist' },
    releaseDate: { type: Date, required: true },
    coverAt: { type: String, required: true },
    songs: { type: [mongoose.Types.ObjectId], ref: 'Song' },
  },
  {
    timestamps: true,
  }
);

// Tạo model từ schema
const Album = mongoose.model<IAlbum>('Album', albumSchema);
export default Album;
