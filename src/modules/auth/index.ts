import { Router } from 'express';
import AuthController from './AuthController';
import { loginMiddleware, registerMiddleware } from '@/middlewares/userBody.middleware';
import { authMiddleware } from '@/middlewares/auth.middleware';

const AuthRouter = Router();

AuthRouter.post('/login', loginMiddleware, AuthController.login);
AuthRouter.post('/register', registerMiddleware, AuthController.register);
AuthRouter.get('/my-info', authMiddleware, AuthController.getMyInfo);

export default AuthRouter;
