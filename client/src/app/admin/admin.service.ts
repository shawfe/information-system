import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from 'app/auth/auth.service';
import { IGroupRef, IGroupWithUsers, IUpdateGroup } from 'app/models/group.data';
import { ConfirmationStatus, UpdateUserByAdminData, UserShortData } from 'app/models/user.data';
import { GroupsRequestsService } from 'app/services/groups-requests.service';
import { UsersRequestsService } from 'app/services/users-requests.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class AdminService {
  private _adminPortal$ = new BehaviorSubject<ComponentPortal<any>>(null);
  private _groups$ = new BehaviorSubject<IGroupRef[]>([]);
  private _groupsWithUsers$ = new BehaviorSubject<IGroupWithUsers[]>([]);
  private _users$ = new BehaviorSubject<UserShortData[]>([]);

  constructor(
    private _authService: AuthService,
    private _usersRequestsService: UsersRequestsService,
    private _groupsRequestsService: GroupsRequestsService
  ) {}

  init(): void {
    this.loadGroups();
  }

  destroy(): void {
    this._setUsers([]);
    this._setGroups([]);
    this._setUsers([]);
    this._setGroups([]);
    this.setGroupsWithUsers([]);
  }

  public setAdminPortal(portal?: ComponentPortal<any>): void {
    this._adminPortal$.next(portal);
  }

  public getAdminPortalObservable(): Observable<ComponentPortal<any>> {
    return this._adminPortal$.asObservable();
  }

  public clearPortal(): void {
    this.setAdminPortal();
  }

  public getUsers(): UserShortData[] {
    return this._users$.getValue();
  }

  public getUsersObservable(): Observable<UserShortData[]> {
    return this._users$.asObservable();
  }

  public getGroups(): IGroupRef[] {
    return this._groups$.getValue();
  }

  public getGroupsObservable(): Observable<IGroupRef[]> {
    return this._groups$.asObservable();
  }

  public getGroupsWithUsers(): IGroupWithUsers[] {
    return this._groupsWithUsers$.getValue();
  }

  public setGroupsWithUsers(value: IGroupWithUsers[]): void {
    this._groupsWithUsers$.next(value);
  }

  public getGroupsWithUsersObservable(): Observable<IGroupWithUsers[]> {
    return this._groupsWithUsers$.asObservable();
  }

  public initiateLogout() {
    this._authService.logout();
  }

  public loadUsers(confirmationStatus?: ConfirmationStatus): void {
    this._usersRequestsService.requestUsers(confirmationStatus).subscribe((users) => {
      this._setUsers(users);
    });
  }

  public loadGroups(): void {
    this._groupsRequestsService.requestGroups().subscribe((groups) => {
      this._setGroups(groups);
    });
  }

  public loadGroupsWithUsers(): void {
    this._groupsRequestsService.requestGroupsWithUsers().subscribe((groups) => {
      this.setGroupsWithUsers(groups);
    });
  }

  public acceptUser(id: string, groupId: string): void {
    this._usersRequestsService.requestAcceptUser(id, groupId).subscribe(() => {
      const users = this.getUsers();
      const userToRemoveIndex = users.findIndex((user) => user.id === id);

      if (userToRemoveIndex !== -1) {
        users.splice(userToRemoveIndex, 1);
        this._setUsers(users);
      }
    });
  }

  public removeUser(id: string): void {
    this._usersRequestsService.requestRemoveUser(id).subscribe(() => {
      const users = this.getUsers();
      const userToRemoveIndex = users.findIndex((user) => user.id === id);

      if (userToRemoveIndex !== -1) {
        users.splice(userToRemoveIndex, 1);
        this._setUsers(users);
      }
    });
  }

  public createGroup(name: string): void {
    this._groupsRequestsService.requestCreateGroup(name).subscribe((group) => {
      const groupWithUsers: IGroupWithUsers = {
        ...group,
        users: []
      };

      const groups = [...this.getGroupsWithUsers(), groupWithUsers].sort(this._sortByName);
      this.setGroupsWithUsers(groups);
    });
  }

  public updateUsers(usersToUpdate: UpdateUserByAdminData[]): Observable<any> {
    return this._usersRequestsService.requestUpdateUsers(usersToUpdate);
  }

  public removeUsers(userIds: string[]): Observable<any> {
    return this._usersRequestsService.requestRemoveUsers(userIds);
  }

  public updateGroups(groupsToUpdate: IUpdateGroup[]): Observable<any> {
    return this._groupsRequestsService.requestUpdateGroups(groupsToUpdate);
  }

  public removeGroups(groupIds: string[]): Observable<any> {
    return this._groupsRequestsService.requestRemoveGroups(groupIds);
  }

  public resetControl(control: FormControl, value?: any) {
    if (typeof value !== 'undefined') {
      control.setValue(value);
    }

    control.markAsPristine();
    control.markAsUntouched();
    control.updateValueAndValidity();
  }

  private _setUsers(value: UserShortData[]): void {
    this._users$.next(value);
  }

  private _setGroups(value: IGroupRef[]): void {
    this._groups$.next(value);
  }

  private _sortByName(first: IGroupRef, second: IGroupRef): number {
    const firstName = first.name.toLocaleLowerCase();
    const secondName = second.name.toLocaleLowerCase();
    if (firstName < secondName) {
      return -1;
    }
    if (firstName > secondName) {
      return 1;
    }
    return 0;
  }
}
