import jwt from "jsonwebtoken";
import envConfig from "../common/config/config";
import BadRequestException from "@/common/exception/BadRequestException";
import ErrorCode from "@/common/constants/errorCode";
import { UserInfo } from "@/common/interfaces/express";

class JwtHandler {
  generateAccessToken(uid: string, role: string) {
    const accessToken = jwt.sign(
      {
        uid,
        role
      },
      envConfig.JWTKey,
      { expiresIn: '1h' }
    );

    return accessToken;
  }

  verifyAccessToken(accessToken: string) {
    const payload = jwt.verify(accessToken, envConfig.JWTKey);
    return payload as UserInfo
  }

  generateRefreshToken(uid: string) {
    const refreshToken = jwt.sign(
      {
        uid
      },
      envConfig.JWTRefreshKey,
      { expiresIn: '365d' }
    );

    return refreshToken;
  }



  verifyRefreshToken(refreshToken: string) {
    const payload = jwt.verify(refreshToken, envConfig.JWTRefreshKey);
    return (payload as { uid: string }).uid;
  }

  generateVerifyEmailToken(email: string) {
    const emailToken = jwt.sign(
      {
        email
      },
      envConfig.JWTKey,
      { expiresIn: '5m' }
    );

    return emailToken;
  }

  verifyEmailToken(emailToken: string) {
    try {
      return jwt.verify(emailToken, envConfig.JWTKey) as { email: string };
    } catch (error: any) {
      throw new BadRequestException({
        errorCode: ErrorCode.VERIFY_FAILED,
        errorMessage: "Your session is invalid or expired",
      });
    }
  }

}
export default new JwtHandler()