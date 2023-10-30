import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Model } from 'mongoose';

import { Group, GroupDocument } from '@schemas/group.schema';

import UpdateGroupDto from '@modules/groups/dto/update-group.dto';
import CreateGroupDto from '@modules/groups/dto/create-group.dto';

@Injectable()
export class GroupsDatabaseService {
  constructor(@InjectModel(Group.name) private groupModel: Model<GroupDocument>) {}

  public async findAll(): Promise<Group[]> {
    return this.groupModel.find();
  }

  public async findOneByID(id: string): Promise<Group> {
    const objectId = new mongoose.Types.ObjectId(id.trim());
    return this.groupModel.findOne({ _id: objectId });
  }

  public async findOneByName(name: string): Promise<Group> {
    return await this.groupModel.findOne({ name });
  }

  public async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const newGroup = new this.groupModel(createGroupDto);
    return newGroup.save();
  }

  public async update(id: string, updateGroupDto: UpdateGroupDto): Promise<Group> {
    const objectId = new mongoose.Types.ObjectId(id.trim());
    return this.groupModel.findByIdAndUpdate(objectId, updateGroupDto, { new: true });
  }

  public async remove(id: string): Promise<Group> {
    const objectId = new mongoose.Types.ObjectId(id.trim());
    return this.groupModel.findByIdAndRemove(objectId);
  }
}
