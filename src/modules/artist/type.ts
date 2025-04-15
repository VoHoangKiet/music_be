import mongoose from "mongoose";

export interface IArtistDTO {
    name: string;
    avatar: string;
    bio: string;
    genre: mongoose.Types.ObjectId;
  }