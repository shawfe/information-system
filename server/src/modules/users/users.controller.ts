import { GroupsService } from '@modules/groups/groups.service';
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
  Req,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import AcceptUserDto from './dto/accept-user.dto';
import RequestUpdateUserDto from './dto/request-update-user.dto';
import RequestUpdateUsersDto from './dto/request-update-users.dto';
import { ConfirmationStatus } from './dto/types.dto';
import UserDataDto from './dto/user-data.dto';
import UserLongDataDto from './dto/user-long-data';
import RequestWithUser from './interfaces/request-with-user.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private _usersService: UsersService) {}

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  async getMe(@Req() request: RequestWithUser): Promise<UserLongDataDto> {
    return this._usersService.getMe(request.user);
  }

  @Get()
  getAll(
    @Query('confirmationStatus') confirmationStatus: ConfirmationStatus
  ): Promise<UserDataDto[]> {
    return this._usersService.getUsers(confirmationStatus);
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<UserDataDto> {
    return this._usersService.getUserById(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this._usersService.removeUser(id);
  }

  @Put('accept')
  acceptUser(@Body() acceptUserDto: AcceptUserDto): Promise<void> {
    return this._usersService.acceptUser(acceptUserDto);
  }

  @Put('/me/:id')
  updateMe(@Body() updateUserDto: RequestUpdateUserDto, @Param('id') id: string): Promise<void> {
    return this._usersService.updateUser(id, updateUserDto);
  }

  @Post('/update')
  @HttpCode(200)
  updateSome(@Body() data: { users: RequestUpdateUsersDto[] }): Promise<void> {
    return this._usersService.updateUsers(data.users);
  }

  @Post('/remove')
  @HttpCode(200)
  removeSome(@Body() data: { ids: string[] }): Promise<void> {
    return this._usersService.removeUsers(data.ids);
  }
}
