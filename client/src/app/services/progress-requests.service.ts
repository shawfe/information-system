import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IExercise } from 'app/models/exercise.data';
import { IProgress } from 'app/models/progress.data';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProgressRequestsService {
  private readonly PROGRESS_URL = 'api/progress';

  constructor(private _http: HttpClient) {}

  public requestProgressUser(userId: string): Observable<IProgress> {
    const httpParams = new HttpParams().set('userId', userId);
    return this._http.get<IProgress>(`${this.PROGRESS_URL}/one`, { params: httpParams });
  }

  public requestProgressMe(): Observable<IProgress> {
    return this._http.get<IProgress>(`${this.PROGRESS_URL}/me`);
  }

  public requestUpdateProgressChapter(chapterId: string): Observable<any> {
    return this._http.post(`${this.PROGRESS_URL}/chapter`, { chapterId });
  }

  public requestUpdateProgressExercise(exercise: IExercise): Observable<any> {
    return this._http.post(`${this.PROGRESS_URL}/exercise`, { exercise });
  }

  public requestFinishedItems(): Observable<{ finishedItems: string[] }> {
    return this._http.get<{ finishedItems: string[] }>(`${this.PROGRESS_URL}/finished-items`);
  }
}
