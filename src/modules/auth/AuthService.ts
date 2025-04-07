import BadRequestException from '@/common/exception/BadRequestException';
import User from '@/databases/entities/User';
import ErrorCode from '@/common/constants/errorCode';
import UnauthorizedExeption from '@/common/exception/UnauthorizedExeption';
import Jwt from '@/utils/Jwt';
import hashing from '@/utils/hashing';

class AuthService {
  async findUserById(_id: string) {
    return await User.findOne({ _id });
  }

  async findUserByEmail(email: string) {
    return await User.findOne({ email });
  }

  async login(email: string, password: string) {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException({
        errorCode: ErrorCode.NOT_FOUND,
        errorMessage: "Not found user with this email",
      });
    }
    // if (user.role == "blocker") {
    //   throw new ForbiddenException({
    //     errorCode: ErrorCode.BLOCKED,
    //     errorMessage: "You are blocked",
    //   });
    // }
    // if (user.state !== "active") {
    //   throw new BadRequestException({
    //     errorCode: ErrorCode.VERIFY_EMAIL_NEED,
    //     errorMessage: "You need to verify email",
    //   });
    // }

    const isCorrectPassword = await hashing.comparePassword(
      password,
      user.password
    );
    if (!isCorrectPassword)
      throw new UnauthorizedExeption({
        errorCode: ErrorCode.INCORRECT,
        errorMessage: "Incorrect password",
      });
    const accessToken = Jwt.generateAccessToken(user.id, user.adminId ? "ADMIN" : "USER");
    const refreshToken = Jwt.generateRefreshToken(user.id);
    return { accessToken, refreshToken };
  }

  async register(username: string, email: string, password: string, phone: string) {
    const userExist = await User.findOne({ email });
    if (userExist) {
      throw new BadRequestException({
        errorCode: ErrorCode.EXIST,
        errorMessage: "Email has been registered",
      });
    }
    const hashedPassword = await hashing.hashPassword(password);
    const newUser = new User({
      username,
      email,
      phone,
      password: hashedPassword,
    });
    return await newUser.save();
  }
}

export default new AuthService();
