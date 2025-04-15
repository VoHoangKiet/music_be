import MusicalArtist, { IMusicalArtist } from '@/databases/entities/Artist';
import BadRequestException from '@/common/exception/BadRequestException';
import ErrorCode from '@/common/constants/errorCode';
import Album from '@/databases/entities/Album';
import { IArtistDTO } from './type';



class ArtistService {
  async createArtist(artistDTO: IArtistDTO): Promise<IMusicalArtist> {
    const existingArtist = await MusicalArtist.findOne({
      name: artistDTO.name,
    });
    if (existingArtist) {
      throw new BadRequestException({
        errorCode: ErrorCode.EXIST,
        errorMessage: 'Artist with this name already exists',
      });
    }
    const newArtist = new MusicalArtist({
      name: artistDTO.name,
      avatar: artistDTO.avatar,
      bio: artistDTO.bio,
      genre: artistDTO.genre,
    });
    return await newArtist.save();
  }

  async getAllArtists(): Promise<IMusicalArtist[]> {
    return await MusicalArtist.find().populate('genre');
  }

  async getArtistById(id: string): Promise<IMusicalArtist> {
    const artist = await MusicalArtist.findById(id).populate('genre');
    if (!artist) {
      throw new BadRequestException({
        errorCode: ErrorCode.NOT_FOUND,
        errorMessage: 'Artist not found',
      });
    }
    return artist;
  }

  async updateArtist(
    id: string,
    artistDTO: IArtistDTO
  ): Promise<IMusicalArtist> {
    const artist = await this.getArtistById(id);

    if (artistDTO.name && artistDTO.name !== artist.name) {
      const existingArtist = await MusicalArtist.findOne({ name: artistDTO.name });
      if (existingArtist) {
        throw new BadRequestException({
          errorCode: ErrorCode.EXIST,
          errorMessage: 'Another artist with this name already exists',
        });
      }
      artist.name = artistDTO.name;
    }

    if (artistDTO.avatar) artist.avatar = artistDTO.avatar;
    if (artistDTO.bio) artist.bio = artistDTO.bio;
    if (artistDTO.genre) artist.genre = artistDTO.genre;

    return await artist.save();
  }

  async deleteArtist(id: string): Promise<{ message: string }> {
    const artist = await this.getArtistById(id);

    // Check if artist is referenced in any albums
    const album = await Album.findOne({ artist: id });

    if (album) {
      throw new BadRequestException({
        errorCode: ErrorCode.EXIST,
        errorMessage: 'Cannot delete artist: it is being referenced by albums',
      });
    }

    await MusicalArtist.deleteOne({ _id: id });
    return { message: 'Artist deleted successfully' };
  }
}

export default new ArtistService();
