import { Injectable } from '@angular/core';
import { IUserData } from 'app/models/user.data';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class StateManagerUserService {
  private _currentUser$ = new BehaviorSubject<IUserData>(null);

  public getCurrentUser(): IUserData {
    return this._currentUser$.getValue();
  }

  public setCurrentUser(value: IUserData): void {
    this._currentUser$.next(value);
  }

  public getCurrentUserObservable(): Observable<IUserData> {
    return this._currentUser$.asObservable();
  }
}
