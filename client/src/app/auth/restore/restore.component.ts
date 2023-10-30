import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EMAIL_PATTERN } from 'app/models/auth.data';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';

@Component({
  selector: 'restore',
  templateUrl: './restore.component.html',
  styleUrls: ['./restore.component.scss']
})
export class RestoreComponent implements OnInit {
  public emailControl: FormControl;

  constructor(
    private _authService: AuthService,
    private _translateService: TranslateService,
    private _toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.emailControl = new FormControl('', [
      Validators.required,
      Validators.pattern(EMAIL_PATTERN)
    ]);
  }

  public restorePassword(): void {
    this._authService.resore(this.emailControl.value).subscribe({
      next: () => {
        this._translateService.get('RESTORE_CKECK_EMAIL').subscribe((message) => {
          this._toastrService.success(message);
        });
      },
      error: () => {
        this._translateService.get('RESTORE_ERROR').subscribe((message) => {
          this._toastrService.error(message);
        });
      },
      complete: () => {
        this.emailControl.setValue('');
        this.emailControl.markAsPristine();
        this.emailControl.markAsUntouched();
        this.emailControl.updateValueAndValidity();
      }
    });
  }
}
