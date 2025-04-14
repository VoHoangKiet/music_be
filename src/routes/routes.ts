import AuthRouter from '@/modules/auth';
import PlaylistRouter from '@/modules/playlist';
import SongRouter from '@/modules/song';
import Router from 'express';
const router = Router();

router.use('/auth', AuthRouter);
router.use('/song', SongRouter);
router.use('/playlist', PlaylistRouter);

export default router;
