import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MIN_LENGTH_PASSWORD } from 'app/models/auth.data';
import { CustomValidators } from 'app/utilities/validator.utilits';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'profile-password',
  templateUrl: './profile-password.component.html',
  styleUrls: ['./profile-password.component.scss']
})
export class ProfilePasswordComponent implements OnInit {
  public passwordFormGroup: FormGroup;

  public hidePasswordStates = {
    oldPassword: true,
    newPassword: true,
    confirmNewPassword: true
  };

  public minLengthPassword = MIN_LENGTH_PASSWORD;

  get oldPasswordControl(): FormControl {
    return this.passwordFormGroup.get('oldPassword') as FormControl;
  }

  get newPasswordControl(): FormControl {
    return this.passwordFormGroup.get('newPassword') as FormControl;
  }

  get repeatNewPasswordControl(): FormControl {
    return this.passwordFormGroup.get('repeatNewPassword') as FormControl;
  }

  constructor(private _profileService: ProfileService) {}

  ngOnInit(): void {
    this.passwordFormGroup = new FormGroup(
      {
        oldPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(this.minLengthPassword)
        ]),
        newPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(this.minLengthPassword)
        ]),
        repeatNewPassword: new FormControl('', [Validators.required])
      },
      CustomValidators.mustMatch('newPassword', 'repeatNewPassword')
    );
  }

  public onSave(): void {
    this._profileService.updateCurrnetUser({
      oldPassword: this.oldPasswordControl.value,
      newPassword: this.newPasswordControl.value
    });
  }

  public passwordShowHide(key: 'oldPassword' | 'newPassword' | 'confirmNewPassword'): void {
    this.hidePasswordStates[key] = !this.hidePasswordStates[key];
  }
}
