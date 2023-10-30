import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IGroupRef, IGroupWithUsers, IUpdateGroup } from 'app/models/group.data';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GroupsRequestsService {
  private readonly GROUPS_URL = 'api/groups';

  constructor(private _http: HttpClient) {}

  public requestGroups(): Observable<IGroupRef[]> {
    return this._http.get<IGroupRef[]>(this.GROUPS_URL);
  }

  public requestGroupsWithUsers(): Observable<IGroupWithUsers[]> {
    const httpParams = new HttpParams().set('withUsers', true);
    return this._http.get<IGroupWithUsers[]>(this.GROUPS_URL, { params: httpParams });
  }

  public requestCreateGroup(name: string): Observable<IGroupRef> {
    return this._http.post<IGroupRef>(this.GROUPS_URL, { name: name });
  }

  public requestUpdateGroups(groups: IUpdateGroup[]): Observable<any> {
    return this._http.post(`${this.GROUPS_URL}/update`, { groups: groups });
  }

  public requestRemoveGroups(ids: string[]): Observable<any> {
    return this._http.post(`${this.GROUPS_URL}/remove`, { ids: ids });
  }
}
