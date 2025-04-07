import mongoose, { Document, Schema } from 'mongoose';

// Định nghĩa interface cho Album
export interface IAlbum extends Document {
  title: string;
  artistId?: mongoose.Types.ObjectId;
  releaseDate: Date;
  coverAt: string;
  createdAt: Date;
  updatedAt: Date;
}

const albumSchema: Schema<IAlbum> = new Schema(
  {
    title: { type: String, required: true },
    artistId: { type: mongoose.Types.ObjectId, required: true, ref: 'Artist' },
    releaseDate: { type: Date, required: true },
    coverAt: { type: String, required: true },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Tạo model từ schema
const Album = mongoose.model<IAlbum>('Album', albumSchema);
export default Album;
