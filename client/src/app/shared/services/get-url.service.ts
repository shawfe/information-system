import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable()
export class GetUrlService {
  constructor() {}

  public get(): string {
    return `${environment.BACKEND_URL}${environment.BACKEND_URL}${
      environment.BACKEND_PORT ? ':' : ''
    }${environment.BACKEND_PORT}/api/${environment.API_VERSION}`;
  }
}
