import { RequestCustom, ResponseCustom } from '@/utils/expressCustom';
import { NextFunction } from 'express';
import PlaylistService from './PlaylistService';
import BadRequestException from '@/common/exception/BadRequestException';
import { HttpStatusCode } from '@/common/constants';
import ErrorCode from '@/common/constants/errorCode';

class PlaylistController {
  async createPlaylist(request: RequestCustom, response: ResponseCustom, next: NextFunction) {
    try {
      const { name, description, songs } = request.body;
      const { uid } = request.userInfo;

      if (!name || !description) {
        throw new BadRequestException({
          errorCode: ErrorCode.FAILED_VALIDATE_BODY,
          errorMessage: 'Name and description are required',
        });
      }

      const playlist = await PlaylistService.createPlaylist({
        name,
        description,
        songs,
        userId: uid,
      });

      return response.status(HttpStatusCode.CREATED).json({
        httpStatusCode: HttpStatusCode.CREATED,
        data: playlist,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyPlaylists(request: RequestCustom, response: ResponseCustom, next: NextFunction) {
    try {
      const { uid } = request.userInfo;
      const playlists = await PlaylistService.getPlaylistsByUser(uid);
      return response.status(HttpStatusCode.OK).json({
        httpStatusCode: HttpStatusCode.OK,
        data: playlists,
      });
    } catch (error) {
      next(error);
    }
  }

  async toggleSongInPlaylist(request: RequestCustom, response: ResponseCustom, next: NextFunction) {
    try {
      const { uid } = request.userInfo;
      const { playlistId, songId } = request.params;

      const updatedPlaylist = await PlaylistService.toggleSongInPlaylist(uid, playlistId, songId);
      return response.status(HttpStatusCode.OK).json({
        httpStatusCode: HttpStatusCode.OK,
        data: updatedPlaylist,
      });
    } catch (error) {
      next(error);
    }
  }
  async deletePlaylist(req: RequestCustom, res: ResponseCustom, next: NextFunction) {
    try {
      const { playlistId } = req.params;
      await PlaylistService.deletePlaylistById(playlistId);

      return res.status(HttpStatusCode.OK).json({
        httpStatusCode: HttpStatusCode.OK,
        data: "Playlist deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new PlaylistController();
