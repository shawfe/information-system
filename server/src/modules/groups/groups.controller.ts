import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';

import { GroupsService } from './groups.service';

import GroupWithUsersDto from './dto/group-with-users.dto';
import GroupRefDto from './dto/group-ref.dto';
import CreateGroupDto from './dto/create-group.dto';
import UpdateGroupDto from './dto/update-group.dto';
import RequestUpdateGroupDto from './dto/request-update-group.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('groups')
export class GroupsController {
  constructor(private _groupsService: GroupsService) {}

  @Get()
  getAll(@Query('withUsers') withUsers: boolean): Promise<GroupRefDto[] | GroupWithUsersDto[]> {
    if (withUsers) {
      return this._groupsService.getGroupsWihtUsers();
    }
    return this._groupsService.getGroupsRef();
  }

  @Post('/update')
  @HttpCode(200)
  updateSome(@Body() data: { groups: RequestUpdateGroupDto[] }): Promise<void> {
    return this._groupsService.updateGroups(data.groups);
  }

  @Post('/remove')
  @HttpCode(200)
  removeSome(@Body() data: { ids: string[] }): Promise<void> {
    return this._groupsService.removeGroups(data.ids);
  }

  @Post()
  create(@Body() createGroupDto: CreateGroupDto): Promise<GroupWithUsersDto> {
    return this._groupsService.createGroup(createGroupDto);
  }

  @Put(':id')
  update(@Body() updateGroupDto: UpdateGroupDto, @Param('id') id: string): Promise<void> {
    return this._groupsService.updateGroup(id, updateGroupDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this._groupsService.removeGroup(id);
  }
}
