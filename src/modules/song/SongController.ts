import BadRequestException from '@/common/exception/BadRequestException';
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import SongService from './SongService';
import { RequestCustom, ResponseCustom } from '@/utils/expressCustom';
import { HttpStatusCode } from '@/common/constants';
import { uploadToCloudinary } from '@/utils/upload';
import { parseBuffer } from 'music-metadata';
import Genre from '@/databases/entities/Genre';
import { searchTracks } from '@/utils/searchTrack';
import mongoose from 'mongoose';

class SongController {
  async updateSong(request: RequestCustom, response: ResponseCustom) {
    const { songId } = request.params;
    const data = request.body;
    
    const song = await SongService.updateSong(songId, data);
    return response.status(HttpStatusCode.OK).json({
      httpStatusCode: HttpStatusCode.OK,
      data: song,
    });
  }
  async deleteSong(request: RequestCustom, response: ResponseCustom) {
    const { songId } = request.params;
    const song = await SongService.deleteSong(songId);
    return response.status(HttpStatusCode.OK).json({
      httpStatusCode: HttpStatusCode.OK,
      data: song,
    });
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
  async searchTrack(request: RequestCustom, response: ResponseCustom) {
    const { query } = request.query;
    const tracks = await searchTracks(query as string);
    return response.status(HttpStatusCode.OK).json({
      httpStatusCode: HttpStatusCode.OK,
      data: tracks,
    });
  }
  async importSpotifyTracks(request: RequestCustom, response: ResponseCustom) {
    const { query } = request.query;
    const tracks = await searchTracks(query as string);

    const importTracks = await SongService.importSpotifyTracks(
      tracks,
      new mongoose.Types.ObjectId(request.userInfo.uid)
    );
    return response.status(HttpStatusCode.OK).json({
      httpStatusCode: HttpStatusCode.OK,
      data: importTracks,
    });
  }
}

export default new SongController();
