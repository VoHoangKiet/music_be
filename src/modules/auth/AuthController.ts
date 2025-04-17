import BadRequestException from '@/common/exception/BadRequestException';
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import AuthService from './AuthService';
import { RequestCustom, ResponseCustom } from '@/utils/expressCustom';
import { HttpStatusCode } from '@/common/constants';
import ErrorCode from '@/common/constants/errorCode';
import { IUpdateUserDTO } from './type';

class AuthController {
  async login(request: Request, response: ResponseCustom, next: NextFunction) {
    try {
      const { email, password } = request.body;
      const error = validationResult(request);
      if (!error.isEmpty()) throw new BadRequestException(error.array());
      const { accessToken, user } = await AuthService.login(email, password);
      return response.status(HttpStatusCode.OK).json({
        httpStatusCode: HttpStatusCode.OK,
        data: { accessToken, user },
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
      const { username, email, password, phone } = request.body;
      await AuthService.register(username, email, password, phone);
      return response.status(HttpStatusCode.OK).json({
        httpStatusCode: HttpStatusCode.OK,
        data: 'Register Succesful',
      });
    } catch (error) {
      next(error);
    }
  }
  async getMyInfo(
    request: RequestCustom,
    response: ResponseCustom,
    next: NextFunction
  ) {
    try {
      const { uid } = request.userInfo;
      const info = await AuthService.getMyInfo(uid);
      if (!info) {
        throw new BadRequestException({
          errorCode: ErrorCode.NOT_FOUND,
          errorMessage: 'User information not found',
        });
      }
      return response.status(HttpStatusCode.OK).json({
        httpStatusCode: HttpStatusCode.OK,
        data: info,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUserInfo(req: RequestCustom, res: ResponseCustom) {
    const userId = req.userInfo.uid;
    const updateData: IUpdateUserDTO = req.body;

    const updatedUser = await AuthService.updateUserInfo(userId, updateData);
    res
      .status(HttpStatusCode.OK)
      .json({ httpStatusCode: HttpStatusCode.OK, data: updatedUser });
  }

  async changePassword(req: RequestCustom, res: ResponseCustom) {
    const userId = req.userInfo.uid;
    const { oldPassword, newPassword } = req.body;
    await AuthService.changePassword(userId, oldPassword, newPassword);
    res
      .status(HttpStatusCode.OK)
      .json({ httpStatusCode: HttpStatusCode.OK, data: 'Password changed successfully' });
  }
}

export default new AuthController();
