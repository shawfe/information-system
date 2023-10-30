import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { IUserData, UserUpdateSelf } from 'app/models/user.data';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'profile-data',
  templateUrl: './profile-data.component.html',
  styleUrls: ['./profile-data.component.scss']
})
export class ProfileDataComponent implements OnInit, OnDestroy {
  public firstnameControl: FormControl;
  public lastnameControl: FormControl;
  private _currentUser: IUserData;
  private _unsubscribe = new Subject<void>();

  constructor(private _profileService: ProfileService) {}

  ngOnInit(): void {
    this.firstnameControl = new FormControl('', [
      Validators.required,
      this._sameFirstnameValidator()
    ]);
    this.lastnameControl = new FormControl('', [
      Validators.required,
      this._sameLastnameValidator()
    ]);
    this._profileService
      .getCurrentUserObservale()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((user) => {
        this._currentUser = user;
        this._profileService.resetControl(this.firstnameControl, user.firstName);
        this._profileService.resetControl(this.lastnameControl, user.lastName);
      });
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  private _sameFirstnameValidator(): ValidatorFn {
    return (control: FormControl): ValidationErrors | null => {
      return this._currentUser?.firstName === control.value ? { notChanged: true } : null;
    };
  }

  private _sameLastnameValidator(): ValidatorFn {
    return (control: FormControl): ValidationErrors | null => {
      return this._currentUser?.lastName === control.value ? { notChanged: true } : null;
    };
  }

  public onSave(): void {
    const data: Partial<UserUpdateSelf> = {
      firstName: this.firstnameControl.value,
      lastName: this.lastnameControl.value
    };
    this._profileService.updateCurrnetUser(data);
  }
}
