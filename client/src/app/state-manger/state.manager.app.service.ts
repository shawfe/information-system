import { Injectable } from '@angular/core';
import { AppSectionType } from 'app/models/book.data';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StateManagerAppService {
  private _appSectionType$ = new BehaviorSubject<AppSectionType>(null);

  public getActiveAppSection(): AppSectionType {
    return this._appSectionType$.getValue();
  }

  public setActiveAppSection(value: AppSectionType): void {
    this._appSectionType$.next(value);
  }

  public getActiveAppSectionObservable(): Observable<AppSectionType> {
    return this._appSectionType$.asObservable();
  }
}
