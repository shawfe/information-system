import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ChapterContent,
  ChapterListData,
  CreateChapterData,
  UpdateChapter,
  UpdateChapterOrder
} from 'app/models/chapter.data';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChaptersRequestsService {
  private readonly CHAPTERS_URL = 'api/chapters';

  constructor(private _http: HttpClient) {}

  public requestFullChaptersData(sectionId: string): Observable<ChapterListData[]> {
    let httpParams = new HttpParams().set('sectionId', sectionId);
    return this._http.get<ChapterListData[]>(`${this.CHAPTERS_URL}`, { params: httpParams });
  }

  public requestChapterContent(id: string): Observable<ChapterContent> {
    return this._http.get<ChapterContent>(`${this.CHAPTERS_URL}/content/${id}`);
  }

  public requestCreateChapter(data: CreateChapterData): Observable<ChapterListData> {
    return this._http.post<ChapterListData>(this.CHAPTERS_URL, data);
  }

  public requestUpdateChapter(id: string, data: Partial<UpdateChapter>): Observable<any> {
    return this._http.put(`${this.CHAPTERS_URL}/${id}`, data);
  }

  public requestUpdateChapters(chapters: UpdateChapterOrder[]): Observable<any> {
    return this._http.post(`${this.CHAPTERS_URL}/update`, { chapters });
  }

  public requestRemoveChapter(id: string): Observable<any> {
    return this._http.delete(`${this.CHAPTERS_URL}/${id}`);
  }

  public requestRemoveChapters(ids: string[]): Observable<any> {
    return this._http.post(`${this.CHAPTERS_URL}/remove`, { ids: ids });
  }
}
