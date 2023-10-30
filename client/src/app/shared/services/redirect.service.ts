import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class RedirectService {
  constructor(private _router: Router) {}

  public redirectTo(url: string, isRelative: boolean = true) {
    if (isRelative) {
      this._router.navigate([url]);
    } else {
      window.location.href = url;
    }
  }
}
