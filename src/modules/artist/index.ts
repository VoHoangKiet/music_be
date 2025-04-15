import { Router } from 'express';
import ArtistController from './ArtistController';
import { adminMiddleware } from '@/middlewares/admin.middleware';
import { authMiddleware } from '@/middlewares/auth.middleware';

const ArtistRouter = Router();

ArtistRouter.get('/', ArtistController.getAllArtists);
ArtistRouter.get('/:id', ArtistController.getArtistById);

// Admin Routes (Create, Update, Delete)
ArtistRouter.post('/',authMiddleware, adminMiddleware, ArtistController.createArtist);

ArtistRouter.put('/:id', authMiddleware, adminMiddleware, ArtistController.updateArtist);

ArtistRouter.delete('/:id', authMiddleware, adminMiddleware, ArtistController.deleteArtist);

export default ArtistRouter;
