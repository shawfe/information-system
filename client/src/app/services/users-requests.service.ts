import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ConfirmationStatus,
  IUserData,
  UpdateUserByAdminData,
  UserShortData,
  UserUpdateSelf
} from 'app/models/user.data';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersRequestsService {
  private readonly USERS_URL = 'api/users';

  constructor(private _http: HttpClient) {}

  public requestUserByMe(): Observable<IUserData> {
    return this._http.get<any>(`${this.USERS_URL}/me`);
  }

  public requestUpdateMe(id: string, data: Partial<UserUpdateSelf>): Observable<any> {
    return this._http.put<any>(`${this.USERS_URL}/me/${id}`, data);
  }

  public requestUsers(confirmationStatus?: ConfirmationStatus): Observable<UserShortData[]> {
    let httpParams = new HttpParams();

    if (confirmationStatus) {
      httpParams = httpParams.set('confirmationStatus', confirmationStatus);
    }
    return this._http.get<UserShortData[]>(this.USERS_URL, { params: httpParams });
  }

  public requestAcceptUser(id: string, groupId: string) {
    return this._http.put(`${this.USERS_URL}/accept`, { id: id, groupId: groupId });
  }

  public requestRemoveUser(id: string): Observable<any> {
    return this._http.delete(`${this.USERS_URL}/${id}`);
  }

  public requestUpdateUsers(users: UpdateUserByAdminData[]): Observable<any> {
    return this._http.post(`${this.USERS_URL}/update`, { users: users });
  }

  public requestRemoveUsers(ids: string[]): Observable<any> {
    return this._http.post(`${this.USERS_URL}/remove`, { ids: ids });
  }
}
