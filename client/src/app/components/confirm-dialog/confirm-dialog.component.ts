import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnDestroy {
  public title: string;
  public message: string;
  public reject: string;
  public confirm: string;

  private _unsubscribe = new Subject<void>();

  constructor(
    private _dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _dialogData: any
  ) {
    this._dialogRef
      .keydownEvents()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((keyEvent: KeyboardEvent) => {
        if (keyEvent.key === 'Enter') {
          this._dialogRef.close(true);
        }
      });

    if (typeof _dialogData !== 'undefined') {
      this.title = this._dialogData.title || 'CONFIRM_DIALOG_DEFAULT_TITLE';
      this.message = this._dialogData.message || '';
      this.reject = this._dialogData.reject || 'CANCEL';
      this.confirm = this._dialogData.confirm || 'ACCEPT';
    }
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  public onClose(): void {
    this._dialogRef.close(false);
  }

  public onConfirmClick(): void {
    this._dialogRef.close(true);
  }
}
