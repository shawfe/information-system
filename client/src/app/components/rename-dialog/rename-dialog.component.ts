import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'rename-dialog',
  templateUrl: './rename-dialog.component.html',
  styleUrls: ['./rename-dialog.component.scss']
})
export class RenameDialogComponent implements OnInit {
  public title: string;
  public nameControl: FormControl;

  private _usedNames: string[] = [];
  private _oldName: string;

  constructor(
    private _dialogRef: MatDialogRef<RenameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _dialogData: any
  ) {
    if (typeof _dialogData !== 'undefined') {
      this.title = this._dialogData.title || 'RENAME_DIALOG_DEFAULT_TITLE';
      this._oldName = this._dialogData.oldName || '';
      this._usedNames = this._dialogData.usedNames || [];
    }
  }

  ngOnInit(): void {
    this.nameControl = new FormControl(this._oldName, [Validators.required, this._uniqueName()]);
  }

  public onClose(): void {
    this._dialogRef.close(null);
  }

  public onSaveClick(): void {
    this._dialogRef.close(this.nameControl.value);
  }

  private _uniqueName(): ValidatorFn {
    return (control: FormControl): ValidationErrors | null => {
      if (this._oldName === control.value) {
        return { oldName: true };
      }
      return this._usedNames.some((name) => name === control.value)
        ? { nonuniqueName: true }
        : null;
    };
  }
}
