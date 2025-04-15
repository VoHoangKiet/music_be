import { Router } from 'express';
import GenreController from './GenreController';
import { adminMiddleware } from '@/middlewares/admin.middleware';
import { authMiddleware } from '@/middlewares/auth.middleware';

const GenreRouter = Router();

GenreRouter.get('/', GenreController.getAllGenres);

GenreRouter.get('/:id', GenreController.getGenreById);

GenreRouter.post('/', authMiddleware, adminMiddleware, GenreController.createGenre);

GenreRouter.put('/:id', authMiddleware, adminMiddleware, GenreController.updateGenre);

GenreRouter.delete('/:id', authMiddleware, adminMiddleware, GenreController.deleteGenre);

export default GenreRouter;
