import Genre, { IGenre } from '@/databases/entities/Genre';
import BadRequestException from '@/common/exception/BadRequestException';
import ErrorCode from '@/common/constants/errorCode';
import Song from '@/databases/entities/Song';
import Album from '@/databases/entities/Album';
import MusicalArtist from '@/databases/entities/Artist';
import { getSpotifyToken } from '@/utils/getSpotifyToken';
import axios from 'axios';

class GenreService {
  async createGenre(name: string, description: string): Promise<IGenre> {
    const existingGenre = await Genre.findOne({ name });
    if (existingGenre) {
      throw new BadRequestException({
        errorCode: ErrorCode.EXIST,
        errorMessage: 'Genre with this name already exists',
      });
    }
    const newGenre = new Genre({ name, description });
    return await newGenre.save();
  }

  async getAllGenres(): Promise<IGenre[]> {
    return await Genre.find();
  }

  async getGenreById(id: string): Promise<IGenre> {
    const genre = await Genre.findById(id);
    if (!genre) {
      throw new BadRequestException({
        errorCode: ErrorCode.NOT_FOUND,
        errorMessage: 'Genre not found',
      });
    }
    return genre;
  }

  async updateGenre(
    id: string,
    name?: string,
    description?: string
  ): Promise<IGenre> {
    const genre = await this.getGenreById(id);

    if (name && name !== genre.name) {
      const existingGenre = await Genre.findOne({ name });
      if (existingGenre) {
        throw new BadRequestException({
          errorCode: ErrorCode.EXIST,
          errorMessage: 'Another genre with this name already exists',
        });
      }
      genre.name = name;
    }

    if (description) {
      genre.description = description;
    }

    return await genre.save();
  }

  async deleteGenre(id: string): Promise<{ message: string }> {
    const genre = await this.getGenreById(id);

    // Check for references in other collections
    const [songs, artists] = await Promise.all([
      Song.findOne({ genre: id }),
      MusicalArtist.findOne({ genre: id }),
    ]);

    if (songs || artists) {
      throw new BadRequestException({
        errorCode: ErrorCode.EXIST,
        errorMessage:
          'Cannot delete genre: it is being referenced by songs or artists',
      });
    }

    await Genre.deleteOne({ _id: id });
    return { message: 'Genre deleted successfully' };
  }
  async getOrCreateGenreFromArtist(artistId: string) {
    const token = await getSpotifyToken();

    // Gọi Spotify API để lấy thông tin artist
    const response = await axios.get(
      `https://api.spotify.com/v1/artists/${artistId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);
    const genres: string[] = response.data.genres;

    if (!genres || genres.length === 0) {
      return await Genre.findById('6800f6b4f405b1ade1773b69');
    }

    // Import tất cả genres từ mảng
    const genrePromises = genres.map(async (genreName) => {
      // Tìm genre trong MongoDB
      let genre = await Genre.findOne({ name: genreName });

      // Nếu chưa có thì tạo mới
      if (!genre) {
        genre = new Genre({
          name: genreName,
          description: `Imported from Spotify for artist ${response.data.name}`,
        });
        await genre.save();
      }
      return genre;
    });

    const savedGenres = await Promise.all(genrePromises);
    const genre = savedGenres[0];

    return genre;
  }
}

export default new GenreService();
