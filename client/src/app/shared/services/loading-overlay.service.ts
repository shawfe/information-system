import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatSpinner } from '@angular/material/progress-spinner';
import { map, scan, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingOverlayService {
  private _spin$ = new Subject<boolean>();
  private spinnerTopRef: OverlayRef = this.cdkSpinnerCreate();

  constructor(private overlay: Overlay) {
    this._spin$
      .asObservable()
      .pipe(
        map((val) => (val ? 1 : -1)),
        scan((acc, one) => (acc + one >= 0 ? acc + one : 0), 0)
      )
      .subscribe((res) => {
        if (res === 1) {
          this.showSpinner();
        } else if (res === 0) {
          this.spinnerTopRef.hasAttached() ? this.hideSpinner() : null;
        }
      });
  }

  public showSpinner() {
    this.spinnerTopRef.attach(new ComponentPortal(MatSpinner));
  }
  public hideSpinner() {
    this.spinnerTopRef.detach();
  }

  private cdkSpinnerCreate() {
    let overlayConfig = new OverlayConfig();
    overlayConfig.backdropClass = 'dark-backdrop';
    overlayConfig.hasBackdrop = true;
    overlayConfig.positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();
    this.overlay.create();
    return this.overlay.create(overlayConfig);
  }
}
