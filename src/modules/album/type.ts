import { ObjectId } from 'mongoose';

export interface IAlbumDTO {
  title: string;
  artist: ObjectId;
  releaseDate: Date;
  coverAt: string;
  songs?: ObjectId[];
} 