import BadRequestException from '@/common/exception/BadRequestException';
import User from '@/databases/entities/User';
import ErrorCode from '@/common/constants/errorCode';
import UnauthorizedExeption from '@/common/exception/UnauthorizedExeption';
import Jwt from '@/utils/Jwt';
import hashing from '@/utils/hashing';
import { IUpdateUserDTO } from './type';

class AuthService {
  async findUserById(_id: string) {
    return await User.findOne({ _id });
  }

  async findUserByEmail(email: string) {
    return await User.findOne({ email }).populate('favoriteSongs');
  }

  async login(email: string, password: string) {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException({
        errorCode: ErrorCode.NOT_FOUND,
        errorMessage: 'Not found user with this email',
      });
    }

    const isCorrectPassword = await hashing.comparePassword(
      password,
      user.password
    );
    if (!isCorrectPassword)
      throw new UnauthorizedExeption({
        errorCode: ErrorCode.INCORRECT,
        errorMessage: 'Incorrect password',
      });
    const accessToken = Jwt.generateAccessToken(
      user.id,
      user.adminId ? 'ADMIN' : 'USER'
    );
    const { password: oldPass, ...userWithoutPassword } = user.toObject();
    return { accessToken, user: userWithoutPassword };
  }

  async register(
    username: string,
    email: string,
    password: string,
    phone: string
  ) {
    const userExist = await User.findOne({ email });
    if (userExist) {
      throw new BadRequestException({
        errorCode: ErrorCode.EXIST,
        errorMessage: 'Email has been registered',
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
  async getMyInfo(uid: string) {
    const user = await User.findById(uid).populate('favoriteSongs');
    if (!user) {
      throw new BadRequestException({
        errorCode: ErrorCode.NOT_FOUND,
        errorMessage: 'User not found',
      });
    }
    
    return user;
  }

  async updateUserInfo(userId: string, updateData: IUpdateUserDTO) {
    const user = await User.findById(userId);
    if (!user) {
      throw new BadRequestException({
        errorCode: ErrorCode.NOT_FOUND,
        errorMessage: 'User not found',
      });
    }

    if (updateData.username) user.username = updateData.username;
    if (updateData.phone) user.phone = updateData.phone;

    return await user.save();
  }
}

export default new AuthService();
