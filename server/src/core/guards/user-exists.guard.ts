import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersDatabaseService } from '../database-services/users-database.service';

@Injectable()
export class UserExistsGuard implements CanActivate {
  constructor(private readonly _usersDatabaseService: UsersDatabaseService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this._validateRequest(request);
  }

  private async _validateRequest(request) {
    const userExists = await this._usersDatabaseService.findOneByEmail(request.body.email);

    if (userExists) {
      throw new ForbiddenException('User wuth this email already exists');
    }

    return true;
  }
}
