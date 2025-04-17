import { Router } from 'express';
import AlbumController from './AlbumController';
import { adminMiddleware } from '@/middlewares/admin.middleware';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/', AlbumController.getAllAlbums);
router.get('/:id', AlbumController.getAlbumById);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, AlbumController.createAlbum);
router.put('/:id', authMiddleware, adminMiddleware, AlbumController.updateAlbum);
router.delete('/:id', authMiddleware, adminMiddleware, AlbumController.deleteAlbum);

// Add songs to album
router.post('/:albumId/songs', authMiddleware, adminMiddleware, AlbumController.addSongToAlbum);

// Search album by artist
router.get('/artist/:artistId', AlbumController.searchAlbumByArtist);

export default router;
