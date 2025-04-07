import AuthRouter from '@/modules/auth';
import Router from 'express';
const router = Router();

router.use('/auth', AuthRouter);

export default router;
