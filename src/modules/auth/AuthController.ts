import BadRequestException from '@/common/exception/BadRequestException';
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import AuthService from './AuthService';
import { ResponseCustom } from '@/utils/expressCustom';
import { HttpStatusCode } from '@/common/constants';

class AuthController {
  async login(request: Request, response: ResponseCustom, next: NextFunction) {
    try {
      const { email, password } = request.body;
      const error = validationResult(request);
      if (!error.isEmpty()) throw new BadRequestException(error.array());
      const { accessToken, refreshToken } = await AuthService.login(
        email,
        password
      );
      return response.status(HttpStatusCode.OK).json({
        httpStatusCode: HttpStatusCode.OK,
        data: { accessToken, refreshToken },
      });
    } catch (error) {
      next(error);
    }
  }

  async register(
    request: Request,
    response: ResponseCustom,
    next: NextFunction
  ) {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) throw new BadRequestException(errors.array());
      const { username, email, password, phone } =
        request.body;
      await AuthService.register(
        username,
        email,
        password,
        phone
      );
      return response.status(HttpStatusCode.OK).json({
        httpStatusCode: HttpStatusCode.OK,
        data: "Register Succesful",
      });
    } catch (error) {
      next(error);
    }
  }

}

export default new AuthController();
