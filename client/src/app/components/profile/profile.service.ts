import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from 'app/auth/auth.service';
import { IProgress } from 'app/models/progress.data';
import { IUserData, UserUpdateSelf } from 'app/models/user.data';
import { ProgressRequestsService } from 'app/services/progress-requests.service';
import { StateManagerUserService } from 'app/state-manger/state.manager.user.service';
import { UsersService } from 'app/users/users.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ProfileService {
  private _profilePortal$ = new BehaviorSubject<ComponentPortal<any>>(null);
  private _progress$ = new BehaviorSubject<IProgress>(null);

  constructor(
    private _authService: AuthService,
    private _stateManagerUserService: StateManagerUserService,
    private _usersService: UsersService,
    private _progressRequestsService: ProgressRequestsService
  ) {}

  init() {
    this._progressRequestsService.requestProgressMe().subscribe((progress) => {
      this.setProgress(progress);
    });
  }

  destroy(): void {
    this.setProgress(null);
  }

  public getProfilePortalObservable(): Observable<ComponentPortal<any>> {
    return this._profilePortal$.asObservable();
  }

  public setPortal(portal?: ComponentPortal<any>): void {
    this._profilePortal$.next(portal);
  }

  public clearPortal(): void {
    this.setPortal();
  }

  public initiateLogout() {
    this._authService.logout();
  }

  public getCurrentUser(): IUserData {
    return this._stateManagerUserService.getCurrentUser();
  }

  public getCurrentUserObservale(): Observable<IUserData> {
    return this._stateManagerUserService.getCurrentUserObservable();
  }

  public updateCurrnetUser(data: Partial<UserUpdateSelf>): void {
    this._usersService.updateMe(data);
  }

  public getProgress(): IProgress {
    return this._progress$.getValue();
  }

  public setProgress(value: IProgress): void {
    this._progress$.next(value);
  }

  public getProgressObservable(): Observable<IProgress> {
    return this._progress$.asObservable();
  }

  public resetControl(control: FormControl, value?: any) {
    if (typeof value !== 'undefined') {
      control.setValue(value);
    }

    control.markAsPristine();
    control.markAsUntouched();
    control.updateValueAndValidity();
  }
}
