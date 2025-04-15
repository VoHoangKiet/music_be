import { RequestCustom, ResponseCustom } from '@/utils/expressCustom';
import ArtistService from './ArtistService';
import { validationResult } from 'express-validator';
import BadRequestException from '@/common/exception/BadRequestException';
import { HttpStatusCode } from 'axios';

class ArtistController {
  async createArtist(req: RequestCustom, res: ResponseCustom) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestException(errors.array());
    }

    const { name, avatar, bio, genre } = req.body;
    const newArtist = await ArtistService.createArtist({
      name,
      avatar,
      bio,
      genre,
    });

    res
      .status(HttpStatusCode.Created)
      .json({ httpStatusCode: HttpStatusCode.Created, data: newArtist });
  }

  async getAllArtists(req: RequestCustom, res: ResponseCustom) {
    const artists = await ArtistService.getAllArtists();
    res
      .status(HttpStatusCode.Ok)
      .json({ httpStatusCode: HttpStatusCode.Ok, data: artists });
  }

  async getArtistById(req: RequestCustom, res: ResponseCustom) {
    const { id } = req.params;
    const artist = await ArtistService.getArtistById(id);
    res
      .status(HttpStatusCode.Ok)
      .json({ httpStatusCode: HttpStatusCode.Ok, data: artist });
  }

  async updateArtist(req: RequestCustom, res: ResponseCustom) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestException(errors.array());
    }

    const { id } = req.params;
    const { name, avatar, bio, genre } = req.body;
    const updatedArtist = await ArtistService.updateArtist(id, {
      name,
      avatar,
      bio,
      genre,
    });
    res
      .status(HttpStatusCode.Ok)
      .json({ httpStatusCode: HttpStatusCode.Ok, data: updatedArtist });
  }

  async deleteArtist(req: RequestCustom, res: ResponseCustom) {
    const { id } = req.params;
    const result = await ArtistService.deleteArtist(id);
    res
      .status(HttpStatusCode.Ok)
      .json({ httpStatusCode: HttpStatusCode.Ok, data: result });
  }
}

export default new ArtistController();
