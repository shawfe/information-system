import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '@environments/environment';

@Injectable()
export class ApplicationService {
  constructor(private _iconRegistry: MatIconRegistry, private _sanitizer: DomSanitizer) {
    this._iconRegistry.addSvgIconSet(
      this._sanitizer.bypassSecurityTrustResourceUrl(environment.ICONSET_PATH)
    );
  }
}
