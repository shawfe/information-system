import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor() {}

  /**
   * Intercept an outgoing `HttpRequest` and optionally transform it or the response.
   * @param request http request
   * @param next http handler
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const apiReq = request.clone({ url: request.url.replace('api/', 'api/v1/') });
    return next.handle(apiReq);
  }
}
