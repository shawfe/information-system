import { Injectable } from '@nestjs/common';
import { Group } from '@schemas/group.schema';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { UsersService } from '@modules/users/users.service';
import { GroupRefDto } from './dto/group-ref.dto';
import { GroupWithUsersDto } from './dto/group-with-users.dto';
import { GroupsDatabaseService } from 'src/core/database-services/groups-database.service';
import RequestUpdateGroupDto from './dto/request-update-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    private _usersService: UsersService,
    private _groupsDatabaseService: GroupsDatabaseService
  ) {}

  public toGropRefDto(group: Group): GroupRefDto {
    return new GroupRefDto(group);
  }

  public toGroupWithUsersDto(group: Group): GroupWithUsersDto {
    return new GroupWithUsersDto(group);
  }

  public async getGroupsRef(): Promise<GroupRefDto[]> {
    const dbGroups = await this._groupsDatabaseService.findAll();
    return new Promise((resolve) => resolve(dbGroups.map(this.toGropRefDto)));
  }

  public async getGroupsWihtUsers(): Promise<GroupWithUsersDto[]> {
    const groupsDb = await this._groupsDatabaseService.findAll();
    const usersByGroups = await this._usersService.getUsersByGroups();
    const groupsWithUsers: GroupWithUsersDto[] = [];

    for (const group of groupsDb) {
      const groupWithUsers = this.toGroupWithUsersDto(group);
      groupWithUsers.users = usersByGroups.get(groupWithUsers.id) ?? [];
      groupsWithUsers.push(groupWithUsers);
    }

    return new Promise((resolve) => {
      resolve(groupsWithUsers);
    });
  }

  public async createGroup(createGroupDto: CreateGroupDto): Promise<GroupWithUsersDto> {
    const createdGroup = await this._groupsDatabaseService.create(createGroupDto);
    return new Promise((resolve) => resolve(this.toGroupWithUsersDto(createdGroup)));
  }

  public async updateGroup(id: string, updateGroupDto: UpdateGroupDto): Promise<void> {
    await this._groupsDatabaseService.update(id, updateGroupDto);
    return new Promise((resolve) => resolve());
  }

  public async updateGroups(groupsData: RequestUpdateGroupDto[]): Promise<void> {
    await Promise.allSettled(
      groupsData.map((groupData) => {
        const { id, ...dataWithOutId } = groupData;
        const updateGroupDto: UpdateGroupDto = {
          ...dataWithOutId
        };
        return this._groupsDatabaseService.update(id, updateGroupDto);
      })
    );

    return new Promise((resolve) => resolve());
  }

  public async removeGroup(id: string): Promise<void> {
    await this._groupsDatabaseService.remove(id);
    return new Promise((resolve) => resolve());
  }

  public async removeGroups(ids: string[]): Promise<void> {
    await Promise.allSettled(ids.map((id) => this._groupsDatabaseService.remove(id)));
    return new Promise((resolve) => resolve());
  }
}
