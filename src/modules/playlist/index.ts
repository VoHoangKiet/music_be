import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import PlaylistController from './PlaylistController';

const PlaylistRouter = Router();

// Tạo playlist mới
PlaylistRouter.post('/', authMiddleware, PlaylistController.createPlaylist);

// Lấy tất cả playlist của user
PlaylistRouter.get('/me', authMiddleware, PlaylistController.getMyPlaylists);

// Thêm hoặc xoá bài hát trong playlist
PlaylistRouter.post('/:playlistId/toggle-song/:songId', authMiddleware, PlaylistController.toggleSongInPlaylist);

// xoa playlist
PlaylistRouter.delete("/:playlistId", authMiddleware, PlaylistController.deletePlaylist);

export default PlaylistRouter;
