import { RequestCustom, ResponseCustom } from '@/utils/expressCustom';
import AlbumService from './AlbumService';
import { validationResult } from 'express-validator';
import BadRequestException from '@/common/exception/BadRequestException';
import { HttpStatusCode } from 'axios';
import { IAlbumDTO } from './type';
import ErrorCode from '@/common/constants/errorCode';
class AlbumController {
  async createAlbum(req: RequestCustom, res: ResponseCustom) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestException(errors.array());
    }

    const { title, artist, releaseDate, coverAt } = req.body;
    const newAlbum = await AlbumService.createAlbum({
      title,
      artist,
      releaseDate,
      coverAt,
    });

    res
      .status(HttpStatusCode.Created)
      .json({ httpStatusCode: HttpStatusCode.Created, data: newAlbum });
  }

  async getAllAlbums(req: RequestCustom, res: ResponseCustom) {
    const albums = await AlbumService.getAllAlbums();
    res
      .status(HttpStatusCode.Ok)
      .json({ httpStatusCode: HttpStatusCode.Ok, data: albums });
  }

  async getAlbumById(req: RequestCustom, res: ResponseCustom) {
    const { id } = req.params;
    const album = await AlbumService.getAlbumById(id);
    res
      .status(HttpStatusCode.Ok)
      .json({ httpStatusCode: HttpStatusCode.Ok, data: album });
  }

  async updateAlbum(req: RequestCustom, res: ResponseCustom) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestException(errors.array());
    }

    const { id } = req.params;
    const { title, artist, releaseDate, coverAt } = req.body;
    const updatedAlbum = await AlbumService.updateAlbum(id, {
      title,
      artist,
      releaseDate,
      coverAt,
    });
    res
      .status(HttpStatusCode.Ok)
      .json({ httpStatusCode: HttpStatusCode.Ok, data: updatedAlbum });
  }

  async deleteAlbum(req: RequestCustom, res: ResponseCustom) {
    const { id } = req.params;
    const result = await AlbumService.deleteAlbum(id);
    res
      .status(HttpStatusCode.Ok)
      .json({ httpStatusCode: HttpStatusCode.Ok, data: result });
  }

  async addSongToAlbum(req: RequestCustom, res: ResponseCustom) {
    const { albumId } = req.params;
    const { songIds } = req.body;
    
    if (!Array.isArray(songIds)) {
      throw new BadRequestException({
        errorCode: ErrorCode.FAILED_VALIDATE_BODY,
        errorMessage: 'songIds must be an array',
      });
    }

    const updatedAlbum = await AlbumService.addSongToAlbum(albumId, songIds);
    res
      .status(HttpStatusCode.Ok)
      .json({ httpStatusCode: HttpStatusCode.Ok, data: updatedAlbum });
  }
}

export default new AlbumController(); 