import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Crypto } from 'src/common/crypto';
import { CreateUserDto } from 'src/usecases/user/dto/create-user.dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private crypto: Crypto,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createUserDtoHashedPassword: CreateUserDto = {
      ...createUserDto,
      password: await this.crypto.hash(createUserDto.password),
    };
    const createdUser = new this.userModel(createUserDtoHashedPassword);
    if (!createdUser)
      throw new InternalServerErrorException('Error creating user');

    return createdUser.save().catch((ex) => {
      throw new InternalServerErrorException(ex.message);
    });
  }

  async findMany(params: FilterQuery<UserDocument>): Promise<User[]> {
    return this.userModel
      .find(params)
      .exec()
      .catch((ex) => {
        throw new InternalServerErrorException(ex.message);
      });
  }

  async findUnique({
    _id,
    email,
  }: {
    _id?: string;
    email?: string;
  }): Promise<User> {
    const user = await this.userModel
      .findOne({ $or: [{ _id }, { email }] })
      .catch((ex) => {
        throw new InternalServerErrorException(ex.message);
      });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async delete(_id: string): Promise<User> {
    const user = await this.findUnique({ _id });
    await this.userModel.findByIdAndDelete(_id).catch((ex) => {
      throw new InternalServerErrorException(ex.message);
    });
    return user;
  }
}
