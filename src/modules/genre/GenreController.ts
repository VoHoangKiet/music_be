import { RequestCustom, ResponseCustom } from '@/utils/expressCustom';
import GenreService from './GenreService';
import { validationResult } from 'express-validator';
import BadRequestException from '@/common/exception/BadRequestException';
import { HttpStatusCode } from 'axios';

class GenreController {
  async createGenre(req: RequestCustom, res: ResponseCustom) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestException(errors.array());
    }

    const { name, description } = req.body;
    const newGenre = await GenreService.createGenre(name, description);
    res
      .status(HttpStatusCode.Created)
      .json({ httpStatusCode: HttpStatusCode.Created, data: newGenre });
  }

  async getAllGenres(req: RequestCustom, res: ResponseCustom) {
    const genres = await GenreService.getAllGenres();
    res
      .status(HttpStatusCode.Ok)
      .json({ httpStatusCode: HttpStatusCode.Ok, data: genres });
  }

  async getGenreById(req: RequestCustom, res: ResponseCustom) {
    const { id } = req.params;
    const genre = await GenreService.getGenreById(id);
    res
      .status(HttpStatusCode.Ok)
      .json({ httpStatusCode: HttpStatusCode.Ok, data: genre });
  }

  async updateGenre(req: RequestCustom, res: ResponseCustom) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestException(errors.array());
    }

    const { id } = req.params;
    const { name, description } = req.body;
    const updatedGenre = await GenreService.updateGenre(id, name, description);
    res
      .status(HttpStatusCode.Ok)
      .json({ httpStatusCode: HttpStatusCode.Ok, data: updatedGenre });
  }

  async deleteGenre(req: RequestCustom, res: ResponseCustom) {
    const { id } = req.params;
    const result = await GenreService.deleteGenre(id);
    res
      .status(HttpStatusCode.Ok)
      .json({ httpStatusCode: HttpStatusCode.Ok, data: result });
  }
}

export default new GenreController();
