import mongoose, { Document, Schema } from 'mongoose';

// Định nghĩa interface cho User
export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  phone?: string;
  registerDate: Date;
  adminId?: mongoose.Types.ObjectId;
  favoriteSongs?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    registerDate: { type: Date, default: Date.now, required: true },
    adminId: { type: mongoose.Types.ObjectId, ref: 'Admin' },
    favoriteSongs: [{ type: mongoose.Types.ObjectId, ref: 'Song' }],
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Tạo model từ schema
const User = mongoose.model<IUser>('User', userSchema);
export default User;
