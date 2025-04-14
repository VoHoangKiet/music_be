import BadRequestException from '@/common/exception/BadRequestException';
import User from '@/databases/entities/User';
import ErrorCode from '@/common/constants/errorCode';
import UnauthorizedExeption from '@/common/exception/UnauthorizedExeption';
import Jwt from '@/utils/Jwt';
import hashing from '@/utils/hashing';
import Song, { ISong } from '@/databases/entities/Song';
import { CreateSongDto } from './type';
import mongoose from 'mongoose';

class SongService {
  async findUserById(_id: string) {
    return await User.findOne({ _id });
  }

  async findUserByEmail(email: string) {
    return await User.findOne({ email });
  }

  async login(email: string, password: string) {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException({
        errorCode: ErrorCode.NOT_FOUND,
        errorMessage: 'Not found user with this email',
      });
    }

    const isCorrectPassword = await hashing.comparePassword(
      password,
      user.password
    );
    if (!isCorrectPassword)
      throw new UnauthorizedExeption({
        errorCode: ErrorCode.INCORRECT,
        errorMessage: 'Incorrect password',
      });
    const accessToken = Jwt.generateAccessToken(
      user.id,
      user.adminId ? 'ADMIN' : 'USER'
    );
    return { accessToken };
  }

  async register(
    username: string,
    email: string,
    password: string,
    phone: string
  ) {
    const userExist = await User.findOne({ email });
    if (userExist) {
      throw new BadRequestException({
        errorCode: ErrorCode.EXIST,
        errorMessage: 'Email has been registered',
      });
    }
    const hashedPassword = await hashing.hashPassword(password);
    const newUser = new User({
      username,
      email,
      phone,
      password: hashedPassword,
    });
    return await newUser.save();
  }

  async createSongdata(data: CreateSongDto): Promise<ISong> {
    const song = new Song(data);
    return await song.save();
  }
  async getAllSongs() {
    const songs = await Song.find().populate("genre").sort({ createdAt: -1 })
    return songs;
  }
  async toggleFavoriteSong(userId: string, songId: string) {

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const song = await Song.findById(songId);
    if (!song) {
      throw new Error('Song not found');
    }

    const isFavorite = user.favoriteSongs?.some(
      (favoriteSongId) => favoriteSongId.toString() === songId
    );

    if (isFavorite) {
      user.favoriteSongs = user.favoriteSongs?.filter(
      (favoriteSongId) => favoriteSongId.toString() !== songId
      ); // unfavorite
    } else {
      user.favoriteSongs?.push(new mongoose.Types.ObjectId(songId));
    }

    await user.save();
    return user.favoriteSongs;
  }
}

export default new SongService();
