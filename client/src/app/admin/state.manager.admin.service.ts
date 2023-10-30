import { Injectable } from '@angular/core';
import { AdminPageType } from 'app/models/admin.data';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class StateManagerAdminService {
  private _adminPageType$ = new BehaviorSubject<AdminPageType>('USER_REGISTRATION');

  public getAdminPageType(): AdminPageType {
    return this._adminPageType$.getValue();
  }

  public setAdminPageType(type: AdminPageType): void {
    this._adminPageType$.next(type);
  }

  public getAdminPageTypeObservable(): Observable<AdminPageType> {
    return this._adminPageType$.asObservable();
  }
}
