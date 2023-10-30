import { Injectable } from '@nestjs/common';
import { User } from '@schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import UserDataDto from './dto/user-data.dto';
import UserForGroupDto from './dto/user-for-group.dto';
import UserLongDataDto from './dto/user-long-data';
import { EmailConfirmationService } from 'src/core/email/email-confirmation.service';
import AcceptUserDto from './dto/accept-user.dto';
import UpdateUserByAdminDto from './dto/update-user-by-admin.dto';
import { UsersDatabaseService } from 'src/core/database-services/users-database.service';
import { ConfirmationStatus } from './dto/types.dto';
import * as bcrypt from 'bcrypt';
import RequestUpdateUserDto from './dto/request-update-user.dto';
import RequestUpdateUsersDto from './dto/request-update-users.dto';
import { GroupsDatabaseService } from 'src/core/database-services/groups-database.service';
import { ProgressService } from '@modules/progress/progress.service';

@Injectable()
export class UsersService {
  constructor(
    private _usersDatabaseService: UsersDatabaseService,
    private _emailConfirmationService: EmailConfirmationService,
    private _groupsDatabaseService: GroupsDatabaseService,
    private _progressService: ProgressService
  ) {}

  public toUserDataDto(user: User): UserDataDto {
    return new UserDataDto(user);
  }

  public toUserLongDataDto(user: User, groupName?: string): UserLongDataDto {
    return new UserLongDataDto(user, groupName);
  }

  public async getMe(user: User): Promise<UserLongDataDto> {
    await this._updateActiveDate(user._id.toString());

    const groupDb = user.groupId
      ? await this._groupsDatabaseService.findOneByID(user.groupId)
      : null;
    return new Promise((resolve) => {
      resolve(groupDb ? this.toUserLongDataDto(user, groupDb.name) : this.toUserLongDataDto(user));
    });
  }

  public async getUsers(confirmationStatus: ConfirmationStatus = null): Promise<UserDataDto[]> {
    const usesrsDb = await this._usersDatabaseService.findAll();
    let users = usesrsDb.map(this.toUserDataDto);

    switch (confirmationStatus) {
      case 'CONFIRMED': {
        users = users.filter((user) => user.confirmationStatus === 'CONFIRMED');
        break;
      }
      case 'REGISTERED': {
        users = users.filter((user) => user.confirmationStatus === 'REGISTERED');
        break;
      }
      default: {
      }
    }

    return new Promise((resolve) => resolve(users));
  }

  async getUsersByGroups(): Promise<Map<string, UserForGroupDto[]>> {
    const usersByGroup = new Map<string, UserForGroupDto[]>();
    const users = await this._usersDatabaseService.findAll();

    for (const user of users) {
      if (!user.groupId || user.accountType !== 'USER') {
        continue;
      }

      if (usersByGroup.has(user.groupId)) {
        usersByGroup.get(user.groupId).push(new UserForGroupDto(user));
      } else {
        usersByGroup.set(user.groupId, [new UserForGroupDto(user)]);
      }
    }

    return new Promise((resolve) => {
      resolve(usersByGroup);
    });
  }

  public async getUserById(id: string): Promise<UserDataDto> {
    const userDb = await this._usersDatabaseService.findOneByID(id);
    return new Promise((resolve) => resolve(this.toUserDataDto(userDb)));
  }

  public async getUserByEmail(email: string): Promise<UserDataDto> {
    const userDb = await this._usersDatabaseService.findOneByEmail(email);
    return new Promise((resolve) => resolve(userDb ? this.toUserDataDto(userDb) : null));
  }

  public async createUser(createUserDto: CreateUserDto): Promise<UserDataDto> {
    const createdUser = await this._usersDatabaseService.create(createUserDto);
    return new Promise((resolve) => resolve(this.toUserDataDto(createdUser)));
  }

  public async acceptUser(acceptUserDto: AcceptUserDto): Promise<void> {
    const user = await this._usersDatabaseService.findOneByID(acceptUserDto.id);
    await this._progressService.createProgress(acceptUserDto.id);
    await this._usersDatabaseService.markUserAsConfirmed(acceptUserDto);

    this._emailConfirmationService.sendMessage(
      user.email,
      'Подтверждение аккаунта Web Info System',
      `Ваш аккаунт был успешно подтвержден. Поздравляем!\nСамое время приступить к изучению материала!`
    );
    return new Promise((resolve) => resolve());
  }

  public async updateUser(id: string, requestUpdateUserDto: RequestUpdateUserDto): Promise<void> {
    let error = '';
    const { oldPassword, newPassword, ...requestData } = requestUpdateUserDto;
    const dataToUpdata: Partial<UpdateUserDto> = { ...requestData };

    if (oldPassword) {
      const userDb = await this._usersDatabaseService.findOneByID(id);
      const matchOldPass = await this._comparePassword(oldPassword, userDb.password);
      const matchNewPass = await this._comparePassword(newPassword, userDb.password);
      if (matchOldPass) {
        error = 'Password was not changed';
      } else if (!matchNewPass) {
        error = '';
      } else {
        const hashPass = await this._hashPassword(newPassword);
        dataToUpdata.password = hashPass;
      }
    }

    if (!error) {
      await this._usersDatabaseService.update(id, dataToUpdata);
    }

    return new Promise((resolve, reject) => {
      error ? reject() : resolve();
    });
  }

  public async updateUsers(usersData: RequestUpdateUsersDto[]): Promise<void> {
    await Promise.allSettled(
      usersData.map((userData) => {
        const { id, ...dataWithOutId } = userData;
        const updateUserByAdminDto: UpdateUserByAdminDto = {
          ...dataWithOutId
        };
        return this._usersDatabaseService.update(id, updateUserByAdminDto);
      })
    );

    return new Promise((resolve) => resolve());
  }

  public async removeUser(id: string): Promise<void> {
    await Promise.allSettled([
      this._usersDatabaseService.remove(id),
      this._progressService.removeUserProgress(id)
    ]);
    return new Promise((resolve) => resolve());
  }

  public async removeUsers(ids: string[]): Promise<void> {
    await Promise.allSettled(ids.map((id) => this._usersDatabaseService.remove(id)));
    await Promise.allSettled(ids.map((id) => this._progressService.removeUserProgress(id)));
    return new Promise((resolve) => resolve());
  }

  private async _hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  private async _comparePassword(enteredPassword, dbPassword) {
    return await bcrypt.compare(enteredPassword, dbPassword);
  }

  private async _updateActiveDate(id: string): Promise<User> {
    return this._usersDatabaseService.updateActiveDate(id, this._getFormatedDate());
  }

  private _getFormatedDate(): string {
    const date = new Date();
    let day = '' + date.getDate();
    let month = '' + (date.getMonth() + 1);
    const year = date.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('.');
  }
}
