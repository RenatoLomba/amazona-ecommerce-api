import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Crypto } from 'src/utils/crypto';
import { CreateUserDto } from 'src/usecases/user/dto/create-user.dto';
import { User, UserDocument } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private crypto: Crypto,
  ) {}

  async count() {
    return this.userModel.countDocuments();
  }

  async create(createUserDto: CreateUserDto) {
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

  async findMany(params: FilterQuery<UserDocument>) {
    return this.userModel
      .find(params)
      .exec()
      .catch((ex) => {
        throw new InternalServerErrorException(ex.message);
      });
  }

  async findUnique({ _id, email }: { _id?: string; email?: string }) {
    const user = await this.userModel
      .findOne({ $or: [{ _id }, { email }] })
      .catch((ex) => {
        throw new InternalServerErrorException(ex.message);
      });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(_id: string, data: UpdateUserDto) {
    const user = await this.findUnique({ _id });

    await this.userModel
      .findByIdAndUpdate(
        _id,
        {
          ...data,
          password: data.password
            ? await this.crypto.hash(data.password)
            : user.password,
        },
        { useFindAndModify: false },
      )
      .catch((err) => {
        throw new InternalServerErrorException(err);
      });

    return this.findUnique({ _id });
  }

  async delete(_id: string) {
    const user = await this.findUnique({ _id });
    await this.userModel.findByIdAndDelete(_id).catch((ex) => {
      throw new InternalServerErrorException(ex.message);
    });
    return user;
  }
}
