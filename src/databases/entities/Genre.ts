import mongoose, { Document, Schema } from 'mongoose';

export interface IGenre extends Document {
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const genreSchema: Schema<IGenre> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Tạo model từ schema
const Genre = mongoose.model<IGenre>('Genre', genreSchema);
export default Genre;
