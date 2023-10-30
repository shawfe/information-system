import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CodeExecutionResponse } from 'app/models/code-execution.data';

@Injectable({ providedIn: 'root' })
export class EditorRequestsService {
  private _executionBackendUrl: string = 'api/execute';

  constructor(private _http: HttpClient) {}

  public executeCode(code: string, executeOnce: boolean = true): Observable<CodeExecutionResponse> {
    let httpParams: HttpParams;

    if (executeOnce) {
      httpParams = new HttpParams().set('executeOnce', executeOnce);
    }
    return this._http.post<CodeExecutionResponse>(
      this._executionBackendUrl,
      { code },
      { params: httpParams }
    );
  }
}
