import Genre, { IGenre } from '@/databases/entities/Genre';
import BadRequestException from '@/common/exception/BadRequestException';
import ErrorCode from '@/common/constants/errorCode';
import Song from '@/databases/entities/Song';
import Album from '@/databases/entities/Album';
import MusicalArtist from '@/databases/entities/Artist';

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

  async updateGenre(id: string, name?: string, description?: string): Promise<IGenre> {
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
      MusicalArtist.findOne({ genre: id })
    ]);

    if (songs || artists) {
      throw new BadRequestException({
        errorCode: ErrorCode.EXIST,
        errorMessage: 'Cannot delete genre: it is being referenced by songs or artists'
      });
    }

    await Genre.deleteOne({ _id: id });
    return { message: 'Genre deleted successfully' };
  }
}

export default new GenreService(); 