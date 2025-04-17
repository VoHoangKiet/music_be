import { Router } from 'express';
import SongController from './SongController';
import upload from '@/middlewares/multerConfig';
import { authMiddleware } from '@/middlewares/auth.middleware';

const SongRouter = Router();
SongRouter.post('/upload-audio', upload.single('audio'), SongController.uploadMusic);

SongRouter.get('/', SongController.getAllSongs);
SongRouter.get('/spotify', SongController.searchTrack);
SongRouter.get('/import',authMiddleware, SongController.importSpotifyTracks);

SongRouter.post('/favorite/:songId', authMiddleware, SongController.toggleFavoriteSong);

export default SongRouter;
