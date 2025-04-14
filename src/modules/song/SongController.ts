import BadRequestException from '@/common/exception/BadRequestException';
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import SongService from './SongService';
import { RequestCustom, ResponseCustom } from '@/utils/expressCustom';
import { HttpStatusCode } from '@/common/constants';
import { uploadToCloudinary } from '@/utils/upload';
import { parseBuffer } from 'music-metadata';
import Genre from '@/databases/entities/Genre';

class SongController {
  async uploadMusic(
    request: RequestCustom,
    response: ResponseCustom,
    next: NextFunction
  ) {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) throw new BadRequestException(errors.array());
      if (!request.file) {
        return response.status(HttpStatusCode.BAD_REQUEST).json({
          httpStatusCode: HttpStatusCode.BAD_REQUEST,
          data: 'No file uploaded',
        });
      }

      const metadata = await parseBuffer(
        new Uint8Array(request.file.buffer),
        request.file.mimetype
      );
      console.log(metadata.common.title);
      console.log(metadata.common.artist);
      console.log(metadata.common.album);
      console.log(metadata.common.genre);
      const durationSec = metadata.format.duration || 0;

      const formatDuration = (seconds: number): string => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
      };
      const formattedDuration = formatDuration(durationSec);

      const result = await uploadToCloudinary(request.file.buffer);

      const { title, album, genre, lyric, releaseDate, admin, thumbnail } = request.body;

      // Tạo bài hát
      const newSong = await SongService.createSongdata({
        title,
        album,
        genre,
        lyric,
        releaseDate,
        admin,
        duration: formattedDuration,
        secureUrl: result.secure_url,
        thumbnail
      });

      return response.status(HttpStatusCode.CREATED).json({
        httpStatusCode: HttpStatusCode.CREATED,
        data: {
          song: newSong,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async getAllSongs(
    request: RequestCustom,
    response: ResponseCustom,
    next: NextFunction
  ) {
    try {
      const songs = await SongService.getAllSongs();

      const genre = await Genre.find();
      return response.status(HttpStatusCode.OK).json({
        httpStatusCode: HttpStatusCode.OK,
        data: songs,
      });
    } catch (error) {
      next(error);
    }
  }
  async toggleFavoriteSong(request: RequestCustom, response: ResponseCustom) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) throw new BadRequestException(errors.array());
    const { uid } = request.userInfo;
    const { songId } = request.params;
    
    try {
      const favorites = await SongService.toggleFavoriteSong(uid, songId);
      return response.status(HttpStatusCode.OK).json({
        httpStatusCode: HttpStatusCode.OK,
        data: { favoriteSongs: favorites },
      });
    } catch (error: any) {
      return response.status(HttpStatusCode.BAD_REQUEST).json({
        httpStatusCode: HttpStatusCode.BAD_REQUEST,
        data: { message: error.message },
      });
    }
  }
}

export default new SongController();
