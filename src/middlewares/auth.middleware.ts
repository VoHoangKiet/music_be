import { NextFunction } from "express";
import Jwt from "../utils/Jwt";
import ErrorCode from "@/common/constants/errorCode";
import ForbiddenException from "@/common/exception/ForbiddenException";
import UnauthorizedExeption from "@/common/exception/UnauthorizedExeption";
import { RequestCustom, ResponseCustom } from "@/utils/expressCustom";
export const authMiddleware = async (
  req: RequestCustom,
  _: ResponseCustom,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    throw new UnauthorizedExeption({
      errorMessage: 'Authorization header is missing',
      errorCode: ErrorCode.UNAUTHORIZED,
    });
  }
  const [bearer, accessToken] = authHeader.split(' '); //Check token contain in header
  if (!accessToken || bearer !== 'Bearer') {
    throw new UnauthorizedExeption({
      errorMessage: 'Invalid authorization header',
      errorCode: ErrorCode.UNAUTHORIZED,
    });
  }
  try {
    const payload = Jwt.verifyAccessToken(accessToken);
    req.userInfo = payload;
    return next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new UnauthorizedExeption({
        errorCode: ErrorCode.TOKEN_EXPIRED,
        errorMessage: "Token was expired",
      });
    }
    throw new UnauthorizedExeption({
      errorCode: ErrorCode.VERIFY_FAILED,
      errorMessage: "Invalid token",
    });
  }
};
