import { Injectable } from '@angular/core';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ConfirmDialogComponent } from './confirm-dialog.component';

interface IConfirmParams {
  value: string;
  value1?: string;
  value2?: string;
}

@Injectable()
export class ConfirmDialogService {
  constructor(private dialog: MatDialog, private translate: TranslateService) {}

  /**
   * Call the confirmation dialog
   * @param title the confirmation dialog title
   * @param message the confirmation dialog message
   * @param reject the rejection button title
   * @param confirm the confirmation button title
   */
  public confirm(
    titleKey: string,
    messageKey: string,
    reject: string,
    confirm: string,
    param: string = ''
  ): Observable<boolean> {
    let title: string;
    this.translate.stream(titleKey).subscribe((res: string) => {
      title = res;
    });
    let message: string;
    this.translate.stream(messageKey, { value: param }).subscribe((res: string) => {
      message = res;
    });

    let confirmDialogConfig: MatDialogConfig = {
      panelClass: 'confirm-dialog'
    };

    confirmDialogConfig.data = {
      title: title,
      message: message,
      reject: reject,
      confirm: confirm
    };

    let dialogRef: MatDialogRef<ConfirmDialogComponent> = this.dialog.open(
      ConfirmDialogComponent,
      confirmDialogConfig
    );

    return dialogRef.afterClosed();
  }

  /**
   * Call the confirmation dialog
   * @param title the confirmation dialog title
   * @param message the confirmation dialog message
   * @param reject the rejection button title
   * @param confirm the confirmation button title
   */
  public confirmTwoParams(
    titleKey: string,
    messageKey1: string,
    param1: string,
    messageKey2: string,
    param2: string,
    reject: string,
    confirm: string
  ): Observable<boolean> {
    let title: string;
    this.translate.stream(titleKey).subscribe((res: string) => {
      title = res;
    });
    let message: string;
    this.translate.stream(messageKey1, { value: param1 }).subscribe((res: string) => {
      message = res;
      this.translate.stream(messageKey2, { value: param2 }).subscribe((res2: string) => {
        message += '\n' + res2;
      });
    });

    let confirmDialogConfig: MatDialogConfig = {
      panelClass: 'confirm-dialog'
    };

    confirmDialogConfig.data = {
      title: title,
      message: message,
      reject: reject,
      confirm: confirm
    };

    let dialogRef: MatDialogRef<ConfirmDialogComponent> = this.dialog.open(
      ConfirmDialogComponent,
      confirmDialogConfig
    );

    return dialogRef.afterClosed();
  }

  public confirmWithParams(
    titleKey: string,
    messageKey: string,
    reject: string,
    confirm: string,
    params: IConfirmParams
  ): Observable<boolean> {
    let title: string;
    this.translate.stream(titleKey).subscribe((res: string) => {
      title = res;
    });
    let message: string;
    this.translate
      .stream(messageKey, { value: params.value, value1: params.value1, value2: params.value2 })
      .subscribe((res: string) => {
        message = res;
      });

    let confirmDialogConfig: MatDialogConfig = {
      panelClass: 'confirm-dialog'
    };

    confirmDialogConfig.data = {
      title: title,
      message: message,
      reject: reject,
      confirm: confirm
    };

    let dialogRef: MatDialogRef<ConfirmDialogComponent> = this.dialog.open(
      ConfirmDialogComponent,
      confirmDialogConfig
    );

    return dialogRef.afterClosed();
  }

  public hasOpenedConfirmDialog() {
    return this.dialog.openDialogs.length > 0;
  }

  public getOpenedConfirmDialogs() {
    return this.dialog.openDialogs;
  }
}
