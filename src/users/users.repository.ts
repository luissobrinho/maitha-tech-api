import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(user: UserDto): Promise<UserDocument[]> {
    return this.userModel
      .find({
        $and: [
          {
            userId: user._id,
          },
          {
            userId: { $exists: true },
          },
        ],
      })
      .exec();
  }

  async findById(user: UserDto, id: string): Promise<UserDocument> {
    return this.userModel.findOne({ _id: id, userId: user._id }).exec();
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(
    user: CreateUserDto & { userId?: string },
  ): Promise<UserDocument> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async update(id: string, user: UpdateUserDto): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(id, user, { new: true }).exec();
  }

  async delete(id: string): Promise<UserDocument> {
    return this.userModel.findByIdAndRemove(id).exec();
  }
}
