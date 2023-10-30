import { Injectable } from '@angular/core';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { RenameDialogComponent } from './rename-dialog.component';

@Injectable()
export class RenameDialogService {
  constructor(private dialog: MatDialog, private translate: TranslateService) {}

  public rename(titleKey: string, oldName: string, usedNames: string[]): Observable<string> {
    let title: string;
    this.translate.stream(titleKey).subscribe((res: string) => {
      title = res;
    });

    const renameDialogConfig: MatDialogConfig = {
      panelClass: 'rename-dialog',
      data: {
        title: title,
        oldName: oldName,
        usedNames: usedNames
      }
    };

    const dialogRef: MatDialogRef<RenameDialogComponent> = this.dialog.open(
      RenameDialogComponent,
      renameDialogConfig
    );

    return dialogRef.afterClosed();
  }
}
