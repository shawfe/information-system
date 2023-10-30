import { Injectable } from '@angular/core';
import { IGroupRef, IGroupWithUsers, IUpdateGroup } from 'app/models/group.data';
import { UpdateUserByAdminData, UserShortData } from 'app/models/user.data';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { AdminService } from '../admin.service';

@Injectable()
export class UserEditingService {
  private _usersToUpdate = new Map<string, UserShortData>();
  private _usersToRemoveIds = new Set<string>();
  private _groupsToUpdate = new Map<string, IGroupWithUsers>();
  private _groupsToRemoveIds = new Set<string>();
  private _usersWithNewGroup = new Map<string, IGroupRef>();
  private _isUnsavedChanges$ = new BehaviorSubject<boolean>(false);
  private _isActiveSaveRequst$ = new BehaviorSubject<boolean>(false);

  constructor(private _adminService: AdminService) {}

  destroy(): void {
    this._clearMarkData();
    this._setUnsavedChanges(false);
    this._setActiveSaveRequst(false);
  }

  public getUsersToRemove(): Set<string> {
    return this._usersToRemoveIds;
  }

  public getUnsavedChanges(): boolean {
    return this._isUnsavedChanges$.getValue();
  }

  public getUnsavedChangesObservable(): Observable<boolean> {
    return this._isUnsavedChanges$.asObservable();
  }

  public getActiveSaveRequestObservable(): Observable<boolean> {
    return this._isActiveSaveRequst$.asObservable();
  }

  public getSavedGroupDataForUser(userId: string): IGroupRef {
    return this._usersWithNewGroup.get(userId);
  }

  public saveGroupDataForUser(userId: string, groupData: IGroupRef): void {
    this._usersWithNewGroup.set(userId, groupData);
  }

  public markUserToUpdate(user: UserShortData): void {
    this._usersToUpdate.set(user.id, user);
    this._setUnsavedChanges(true);
  }

  public markUserToRemove(id: string): void {
    this._usersToRemoveIds.add(id);
    this._setUnsavedChanges(true);
  }

  public unmarkUserToRemove(id: string): void {
    this._usersToRemoveIds.delete(id);
    this._setUnsavedChanges(this._checkForUnsavedChanges());
  }

  public markGroupToUpdate(groupToUpdate: IGroupWithUsers): void {
    const groups = this._adminService.getGroupsWithUsers();
    const groupToUpdateIndex = groups.findIndex((group) => group.id === groupToUpdate.id);

    if (groupToUpdateIndex !== -1) {
      this._groupsToUpdate.set(groupToUpdate.id, groupToUpdate);
      groups.splice(groupToUpdateIndex, 1, groupToUpdate);
      this._setUnsavedChanges(true);
      this._adminService.setGroupsWithUsers(groups);
    }
  }

  public markGroupToRemove(id: string): void {
    const groups = this._adminService.getGroupsWithUsers();
    const groupToRemoveIndex = groups.findIndex((group) => group.id === id);

    if (groupToRemoveIndex !== -1) {
      this._groupsToUpdate.delete(groups.at(groupToRemoveIndex).id);
      this._groupsToRemoveIds.add(id);

      for (const user of groups.at(groupToRemoveIndex).users) {
        this._usersToRemoveIds.add(user.id);
        this._usersToUpdate.delete(user.id);
      }

      groups.splice(groupToRemoveIndex, 1);
      this._setUnsavedChanges(true);
      this._adminService.setGroupsWithUsers(groups);
    }
  }

  public saveChanges(): void {
    const requests: Observable<any>[] = [];

    this._setUnsavedChanges(false);
    this._setActiveSaveRequst(true);

    for (const userIdToRemove of this._usersToRemoveIds.values()) {
      this._usersToUpdate.delete(userIdToRemove);
    }

    if (this._usersToUpdate.size) {
      const usersData: UpdateUserByAdminData[] = [];
      for (const user of this._usersToUpdate.values()) {
        usersData.push(user);
      }
      requests.push(this._adminService.updateUsers(usersData));
    }

    if (this._usersToRemoveIds.size) {
      requests.push(this._adminService.removeUsers([...this._usersToRemoveIds]));
    }

    if (this._groupsToUpdate.size) {
      const groupsData: IUpdateGroup[] = [];
      for (const group of this._groupsToUpdate.values()) {
        groupsData.push({
          id: group.id,
          name: group.name
        });
      }
      requests.push(this._adminService.updateGroups(groupsData));
    }

    if (this._groupsToRemoveIds.size) {
      requests.push(this._adminService.removeGroups([...this._groupsToRemoveIds]));
    }

    if (!requests.length) {
      this._clearMarkData();
      this._setActiveSaveRequst(false);
    }

    forkJoin(requests).subscribe({
      complete: () => {
        this._clearMarkData();
        this._setActiveSaveRequst(false);
        this._adminService.loadGroupsWithUsers();
      }
    });
  }

  private _setUnsavedChanges(value: boolean): void {
    this._isUnsavedChanges$.next(value);
  }

  private _setActiveSaveRequst(value: boolean): void {
    this._isActiveSaveRequst$.next(value);
  }

  private _checkForUnsavedChanges(): boolean {
    return (
      this._usersToUpdate.size +
        this._usersToRemoveIds.size +
        this._groupsToUpdate.size +
        this._groupsToRemoveIds.size >
      0
    );
  }

  private _clearMarkData(): void {
    this._usersToUpdate.clear();
    this._usersToRemoveIds.clear();
    this._groupsToUpdate.clear();
    this._groupsToRemoveIds.clear();
    this._usersWithNewGroup.clear();
  }
}
