import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  CreateSection,
  ISection,
  ISectionWithExercises,
  UpdateSection
} from 'app/models/section.data';
import { SectionType } from 'app/models/book.data';

@Injectable({ providedIn: 'root' })
export class BookSectionsRequestsService {
  private readonly BOOK_SECTIONS_URL = 'api/sections';

  constructor(private _http: HttpClient) {}

  public requestBookSections(sectionType: SectionType): Observable<ISection[]> {
    let httpParams = new HttpParams().set('sectionType', sectionType);
    return this._http.get<ISection[]>(this.BOOK_SECTIONS_URL, { params: httpParams });
  }

  public requestBookSectionsWithExercises(
    sectionType: SectionType
  ): Observable<ISectionWithExercises[]> {
    let httpParams = new HttpParams().set('sectionType', sectionType).set('withExercises', true);
    return this._http.get<ISectionWithExercises[]>(this.BOOK_SECTIONS_URL, {
      params: httpParams
    });
  }

  public requestBookSection(id: string): Observable<ISection> {
    return this._http.get<ISection>(`${this.BOOK_SECTIONS_URL}/${id}`);
  }

  public requestCreateBookSection(data: CreateSection): Observable<ISection> {
    return this._http.post<ISection>(this.BOOK_SECTIONS_URL, data);
  }

  public requestUpdateBookSection(id: string, data: Partial<UpdateSection>): Observable<any> {
    return this._http.put(`${this.BOOK_SECTIONS_URL}/${id}`, data);
  }

  public requestRemoveBookSection(id: string): Observable<any> {
    return this._http.delete(`${this.BOOK_SECTIONS_URL}/${id}`);
  }

  public requestRemoveBookSections(ids: string[]): Observable<any> {
    return this._http.post(`${this.BOOK_SECTIONS_URL}/remove`, { ids: ids });
  }
}
