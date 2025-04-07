import mongoose, { Document, Schema } from 'mongoose';

export interface IAdmin extends Document {
  username: string;
  password: string;
  email: string;
  registerDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema: Schema<IAdmin> = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    registerDate: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

// Tạo model từ schema
const Admin = mongoose.model<IAdmin>('Admin', adminSchema);
export default Admin;
