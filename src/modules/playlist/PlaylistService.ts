import Playlist from '@/databases/entities/Playlist';
import BadRequestException from '@/common/exception/BadRequestException';
import mongoose from 'mongoose';
import ErrorCode from '@/common/constants/errorCode';
import { PlaylistCreateDto } from './type';

class PlaylistService {
  async createPlaylist(data: PlaylistCreateDto) {
    const newPlaylist = new Playlist({
      name: data.name,
      description: data.description,
      songs:
        data.songs?.map((songId) => new mongoose.Types.ObjectId(songId)) || [],
      user: new mongoose.Types.ObjectId(data.userId),
    });
    return await newPlaylist.save();
  }

  async getPlaylistsByUser(userId: string) {
    return await Playlist.find({ user: userId }).populate('songs');
  }

  async toggleSongInPlaylist(
    userId: string,
    playlistId: string,
    songId: string
  ) {
    const playlist = await Playlist.findOne({ _id: playlistId, user: userId });
    if (!playlist) {
      throw new BadRequestException({
        errorCode: ErrorCode.FORBIDDEN_ERROR,
        errorMessage: 'Playlist not found or access denied',
      });
    }

    const index = playlist.songs.findIndex((id) => id.toString() === songId);
    if (index >= 0) {
      playlist.songs.splice(index, 1); // Remove song
    } else {
      playlist.songs.push(new mongoose.Types.ObjectId(songId)); // Add song
    }

    await playlist.save();
    return playlist.populate('songs');
  }
  async deletePlaylistById(id: string) {
    const deleted = await Playlist.findByIdAndDelete(id);
    if (!deleted) {
      throw new BadRequestException({
        errorCode: ErrorCode.NOT_FOUND,
        errorMessage: 'Playlist not found',
      });
    }
    return deleted;
  }
}

export default new PlaylistService();
