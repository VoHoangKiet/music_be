import { NextFunction } from "express";
import ForbiddenException from "@/common/exception/ForbiddenException";
import { RequestCustom, ResponseCustom } from "@/utils/expressCustom";
import ErrorCode from "@/common/constants/errorCode";

export const adminMiddleware = (
  req: RequestCustom,
  _: ResponseCustom,
  next: NextFunction
) => {
  // Kiểm tra xem user đã được xác thực chưa (authMiddleware đã gán req.userInfo)
  if (!req.userInfo) {
    throw new ForbiddenException({
      errorMessage: 'User not authenticated',
      errorCode: 'UNAUTHORIZED',
    });
  }
  
  // Kiểm tra nếu user không phải admin
  if (req.userInfo.role !== 'ADMIN') {
    throw new ForbiddenException({
      errorMessage: 'You do not have permission to access this resource',
      errorCode: ErrorCode.FORBIDDEN_ERROR,
    });
  }

  return next();
};
