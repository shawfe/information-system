import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IGenerateLinkData } from 'app/models/generate-link.data';

@Injectable({ providedIn: 'root' })
export class GenerateLinkService {
  private GENERATE_LINK_URL = 'api/generate-link';
  constructor(private _http: HttpClient) {}

  public requestGenerateLink(generateLinkData: IGenerateLinkData): Observable<string> {
    return this._http.post(this.GENERATE_LINK_URL, generateLinkData, {
      responseType: 'text'
    });
  }
}
