import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateExerciseData, IExercise, UpdateExerciseData } from 'app/models/exercise.data';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ExerciseRequestsService {
  private readonly EXERCISE_URL = 'api/exercise';

  constructor(private _http: HttpClient) {}

  public requestExercisesBySection(sectionId: string): Observable<IExercise[]> {
    const httpParams = new HttpParams().set('sectionId', sectionId);
    return this._http.get<IExercise[]>(this.EXERCISE_URL, { params: httpParams });
  }

  public requestExerciseList(): Observable<IExercise[]> {
    return this._http.get<IExercise[]>(`${this.EXERCISE_URL}/list`);
  }

  public requestExercise(exerciseId: string): Observable<IExercise> {
    return this._http.get<IExercise>(`${this.EXERCISE_URL}/${exerciseId}`);
  }

  public requestCreateExercise(data: CreateExerciseData): Observable<IExercise> {
    return this._http.post<IExercise>(this.EXERCISE_URL, data);
  }

  public requestUpdateExercise(exerciseId: string, data: UpdateExerciseData): Observable<any> {
    return this._http.put(`${this.EXERCISE_URL}/${exerciseId}`, data);
  }

  public requestRemoveExercise(exerciseId: string): Observable<any> {
    return this._http.delete(`${this.EXERCISE_URL}/${exerciseId}`);
  }
}
