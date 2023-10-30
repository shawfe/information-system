import { Injectable } from '@angular/core';
import { IProgress } from 'app/models/progress.data';
import { UserShortData } from 'app/models/user.data';
import { GroupsRequestsService } from 'app/services/groups-requests.service';
import { ProgressRequestsService } from 'app/services/progress-requests.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class UserResultsService {
  private _selectedUser$ = new BehaviorSubject<UserShortData>(null);
  private _selectedUserProgress$ = new BehaviorSubject<IProgress>(null);

  constructor(
    private _groupsRequestsService: GroupsRequestsService,
    private _progressRequestsService: ProgressRequestsService
  ) {}

  init(): void {
    this.getSelectedUserObservable().subscribe((user) => {
      if (!user) {
        this.setSelectedUserProgress(null);
        return;
      }
      this.loadUserProgress(user.id);
    });
  }

  destroy(): void {
    this.setSelectedUser(null);
    this.setSelectedUserProgress(null);
  }

  public getSelectedUser(): UserShortData {
    return this._selectedUser$.getValue();
  }

  public setSelectedUser(value: UserShortData): void {
    this._selectedUser$.next(value);
  }

  public getSelectedUserObservable(): Observable<UserShortData> {
    return this._selectedUser$.asObservable();
  }

  public getSelectedUserProgress(): IProgress {
    return this._selectedUserProgress$.getValue();
  }

  public setSelectedUserProgress(value: IProgress): void {
    this._selectedUserProgress$.next(value);
  }

  public getSelectedUserProgressObservable(): Observable<IProgress> {
    return this._selectedUserProgress$.asObservable();
  }

  public loadUserProgress(userId: string): void {
    this._progressRequestsService.requestProgressUser(userId).subscribe((progress) => {
      this.setSelectedUserProgress(progress);
    });
  }
}
