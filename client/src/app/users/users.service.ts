import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { StateManagerUserService } from 'app/state-manger/state.manager.user.service';
import { IUserData, UserUpdateSelf } from 'app/models/user.data';
import { UsersRequestsService } from 'app/services/users-requests.service';

@Injectable()
export class UsersService {
  private _currentUser$ = new BehaviorSubject<IUserData>(null);
  private _fingerPrintIdSubject$ = new BehaviorSubject<string>('');

  constructor(
    private _usersRequestsService: UsersRequestsService,
    private _stateManagerUserService: StateManagerUserService
  ) {
    this._initFingerprintID();
  }

  public getCurrentUser(): IUserData {
    return this._currentUser$.getValue();
  }

  public activate(): Observable<boolean> {
    return new Observable((observer) => {
      this._fingerPrintIdSubject$.asObservable().subscribe((fingerPrintID: string) => {
        if (fingerPrintID !== '') {
          this._usersRequestsService
            .requestUserByMe()
            .pipe()
            .subscribe({
              next: (user: IUserData) => {
                this._stateManagerUserService.setCurrentUser(user);
                this._updateCurrentUser(user);
                observer.next(true);
              },
              error: (error: any) => {
                observer.next(false);
              },
              complete: () => {
                observer.complete();
              }
            });
        }
      });
    });
  }

  public updateMe(data: Partial<UserUpdateSelf>): void {
    this._usersRequestsService.requestUpdateMe(this.getCurrentUser().id, data).subscribe({
      next: () => {
        this._stateManagerUserService.setCurrentUser({
          ...this._stateManagerUserService.getCurrentUser(),
          ...data
        });
      },
      error: () => {
        this._stateManagerUserService.setCurrentUser(
          this._stateManagerUserService.getCurrentUser()
        );
      }
    });
  }

  public clearCurrentUserData(): void {
    this._stateManagerUserService.setCurrentUser(null);
  }

  private _initFingerprintID(): void {
    FingerprintJS.load()
      .then((fp) => fp.get())
      .then((result) => {
        this._fingerPrintIdSubject$.next(result.visitorId);
      });
  }

  private _updateCurrentUser(user: IUserData): void {
    this._currentUser$.next(user);
  }
}
