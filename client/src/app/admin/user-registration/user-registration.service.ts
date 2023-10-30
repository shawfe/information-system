import { Injectable } from '@angular/core';
import { IGroupRef } from 'app/models/group.data';
import { UserShortData } from 'app/models/user.data';
import { Observable } from 'rxjs';
import { AdminService } from '../admin.service';

@Injectable()
export class UserRegistrationService {
  constructor(private _adminService: AdminService) {}

  init(): void {
    this._adminService.loadUsers();
    this._adminService.loadGroups();
  }

  destroy(): void {}

  public getUsersObservable(): Observable<UserShortData[]> {
    return this._adminService.getUsersObservable();
  }

  public getGroupsObservable(): Observable<IGroupRef[]> {
    return this._adminService.getGroupsObservable();
  }

  public acceptUser(id: string, groupId: string): void {
    this._adminService.acceptUser(id, groupId);
  }

  public declineUser(id: string): void {
    this._adminService.removeUser(id);
  }
}
