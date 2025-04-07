import { Router } from 'express';
import AuthController from './AuthController';
import { loginMiddleware, registerMiddleware } from '@/middlewares/userBody.middleware';

const AuthRouter = Router();

AuthRouter.post('/login', loginMiddleware, AuthController.login);
AuthRouter.post('/register', registerMiddleware, AuthController.register);

export default AuthRouter;
