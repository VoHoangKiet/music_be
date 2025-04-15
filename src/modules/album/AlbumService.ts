import Album, { IAlbum } from '@/databases/entities/Album';
import BadRequestException from '@/common/exception/BadRequestException';
import ErrorCode from '@/common/constants/errorCode';
import { IAlbumDTO } from './type';
import ArtistService from '../artist/ArtistService';
import { ObjectId } from 'mongodb';

class AlbumService {
  async createAlbum(albumDTO: IAlbumDTO): Promise<IAlbum> {
    const existingAlbum = await Album.findOne({
      title: albumDTO.title,
    });
    if (existingAlbum) {
      throw new BadRequestException({
        errorCode: ErrorCode.EXIST,
        errorMessage: 'Album with this title already exists',
      });
    }
    const newAlbum = new Album({
      title: albumDTO.title,
      artist: albumDTO.artist,
      releaseDate: albumDTO.releaseDate,
      coverAt: albumDTO.coverAt,
      songs: albumDTO.songs || []
    });
    return await newAlbum.save();
  }

  async getAllAlbums(): Promise<IAlbum[]> {
    return await Album.find().populate('artist').populate('songs');
  }

  async getAlbumById(id: string): Promise<IAlbum> {
    const album = await Album.findById(id).populate('artist').populate('songs');
    if (!album) {
      throw new BadRequestException({
        errorCode: ErrorCode.NOT_FOUND,
        errorMessage: 'Album not found',
      });
    }
    return album;
  }

  async updateAlbum(
    id: string,
    albumDTO: IAlbumDTO
  ): Promise<IAlbum> {
    const album = await this.getAlbumById(id);
    const artistUpdate = await ArtistService.getArtistById(albumDTO.artist.toString());
    if (!artistUpdate) {
      throw new BadRequestException({
        errorCode: ErrorCode.NOT_FOUND,
        errorMessage: 'Artist not found',
      });
    }

    if (albumDTO.title && albumDTO.title !== album.title) {
      const existingAlbum = await Album.findOne({ title: albumDTO.title });
      if (existingAlbum) {
        throw new BadRequestException({
          errorCode: ErrorCode.EXIST,
          errorMessage: 'Another album with this title already exists',
        });
      }
      album.title = albumDTO.title;
    }
    album.artist = artistUpdate._id as unknown as ObjectId;
    if (albumDTO.releaseDate) album.releaseDate = albumDTO.releaseDate;
    if (albumDTO.coverAt) album.coverAt = albumDTO.coverAt;

    return await album.save();
  }

  async deleteAlbum(id: string): Promise<{ message: string }> {
    await Album.deleteOne({ _id: id });
    return { message: 'Album deleted successfully' };
  }

  async addSongToAlbum(albumId: string, songIds: string[]): Promise<IAlbum> {
    const album = await this.getAlbumById(albumId);
    album.songs = songIds as unknown as ObjectId[];
    return await album.save();
  }
}

export default new AlbumService(); 