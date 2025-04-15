import Albumrouter from '@/modules/album';
import ArtistRouter from '@/modules/artist';
import AuthRouter from '@/modules/auth';
import GenreRouter from '@/modules/genre';
import PlaylistRouter from '@/modules/playlist';
import SongRouter from '@/modules/song';
import Router from 'express';
const router = Router();

router.use('/auth', AuthRouter);
router.use('/song', SongRouter);
router.use('/playlist', PlaylistRouter);
router.use('/genre', GenreRouter);
router.use('/artist', ArtistRouter);
router.use('/album', Albumrouter);

export default router;
