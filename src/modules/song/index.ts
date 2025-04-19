import { Router } from 'express';
import SongController from './SongController';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { adminMiddleware } from '@/middlewares/admin.middleware';

const SongRouter = Router();
SongRouter.get('/', SongController.getAllSongs);
SongRouter.get('/spotify', SongController.searchTrack);
SongRouter.post('/import',authMiddleware, SongController.importSpotifyTracks);
SongRouter.post('/import/track',authMiddleware, SongController.import1SpotifyTrack);
SongRouter.get('/play/:songId',authMiddleware, SongController.countPlaySong);
SongRouter.post('/favorite/:songId', authMiddleware, SongController.toggleFavoriteSong);
SongRouter.put('/:songId', authMiddleware,adminMiddleware, SongController.updateSong);
SongRouter.delete('/:songId', authMiddleware,adminMiddleware, SongController.deleteSong);
SongRouter.get('/history', authMiddleware, SongController.getHistory);
SongRouter.get('/recommend', authMiddleware, SongController.recommendByAlbumHistory);
export default SongRouter;
