import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@schemas/user.schema';
import { Model } from 'mongoose';
import mongoose from 'mongoose';

import CreateUserDto from '@modules/users/dto/create-user.dto';
import UpdateUserDto from '@modules/users/dto/update-user.dto';
import AcceptUserDto from '@modules/users/dto/accept-user.dto';
import UpdateUserByAdminDto from '@modules/users/dto/update-user-by-admin.dto';
import { ConfirmationStatus } from '@modules/users/dto/types.dto';

@Injectable()
export class UsersDatabaseService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  public async markEmailAsConfirmed(email: string): Promise<void> {
    await this.userModel.updateOne(
      { email },
      {
        isEmailConfirmed: true
      }
    );
    return new Promise((resolve) => resolve());
  }

  public async markUserAsConfirmed(acceptUserDto: AcceptUserDto): Promise<void> {
    const objectId = new mongoose.Types.ObjectId(acceptUserDto.id.trim());
    const confirmationStatus: ConfirmationStatus = 'CONFIRMED';

    await this.userModel.updateOne(
      { _id: objectId },
      {
        groupId: acceptUserDto.groupId,
        confirmationStatus: confirmationStatus
      }
    );
    return new Promise((resolve) => resolve());
  }

  public async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  public async findOneByID(id: string): Promise<User> {
    const objectId = new mongoose.Types.ObjectId(id.trim());
    return this.userModel.findOne({ _id: objectId });
  }

  public async findOneByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email });
  }

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  public async update(
    id: string,
    updateUserDto: Partial<UpdateUserDto> | UpdateUserByAdminDto
  ): Promise<User> {
    const objectId = new mongoose.Types.ObjectId(id.trim());
    return this.userModel.findByIdAndUpdate(objectId, updateUserDto, { new: true });
  }

  // public async updatePassword(id: string, password: string): Promise<User> {
  //   const objectId = new mongoose.Types.ObjectId(id.trim());
  //   return this.userModel.findByIdAndUpdate(objectId, updateUserDto, { new: true });
  // }

  public async remove(id: string): Promise<User> {
    const objectId = new mongoose.Types.ObjectId(id.trim());
    return this.userModel.findByIdAndRemove(objectId);
  }

  public async updateActiveDate(id: string, date: string): Promise<User> {
    const objectId = new mongoose.Types.ObjectId(id.trim());
    return this.userModel.findByIdAndUpdate(objectId, { lastActiveDate: date });
  }
}
