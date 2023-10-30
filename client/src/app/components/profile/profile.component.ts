import { animate, state, style, transition, trigger } from '@angular/animations';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProfileType } from 'app/models/profile.data';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProfileDataComponent } from './profile-data/profile-data.component';
import { ProfileEmailComponent } from './profile-email/profile-email.component';
import { ProfilePasswordComponent } from './profile-password/profile-password.component';
import { ProfileOverviewComponent } from './profile-profile/profile-overview.component';
import { ProfileService } from './profile.service';

@Component({
  selector: 'profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['./profile.component.scss'],

  animations: [
    trigger('animationWidth', [
      state(
        'open',
        style({
          width: '256px'
        })
      ),
      state(
        'close',
        style({
          width: '80px'
        })
      ),
      transition('open <=> close', animate('400ms 0ms ease-in-out'))
    ]),

    trigger('animationMargin', [
      state(
        'open',
        style({
          marginLeft: '256px'
        })
      ),
      state(
        'close',
        style({
          marginLeft: '80px'
        })
      ),
      transition('open <=> close', animate('400ms 0ms ease-in-out'))
    ])
  ]
})
export class ProfileComponent implements OnInit, OnDestroy {
  public profileTitle$ = new BehaviorSubject<string>('Личный профиль');
  public profileActiveType$ = new BehaviorSubject<ProfileType>('OVERVIEW');
  public profilePortal$: Observable<ComponentPortal<any>>;

  constructor(private _profileService: ProfileService) {}

  ngOnInit(): void {
    this.profilePortal$ = this._profileService.getProfilePortalObservable();
    this._profileService.setPortal(new ComponentPortal(ProfileOverviewComponent));
  }

  ngOnDestroy(): void {
    this._profileService.clearPortal();
  }

  public onProfileNavigationClick(type: ProfileType): void {
    this.profileActiveType$.next(type);
    switch (type) {
      case 'OVERVIEW': {
        this.profileTitle$.next('Личный профиль');
        this._profileService.setPortal(new ComponentPortal(ProfileOverviewComponent));
        break;
      }
      case 'DATA': {
        this.profileTitle$.next('Изменить данные');
        this._profileService.setPortal(new ComponentPortal(ProfileDataComponent));
        break;
      }

      case 'EMAIL': {
        this.profileTitle$.next('Изменить почту');
        this._profileService.setPortal(new ComponentPortal(ProfileEmailComponent));
        break;
      }

      case 'PASSWORD': {
        this.profileTitle$.next('Изменить пароль');
        this._profileService.setPortal(new ComponentPortal(ProfilePasswordComponent));
        break;
      }
      default: {
        this._profileService.clearPortal();
      }
    }
  }

  public onLogoutClick(): void {
    this._profileService.initiateLogout();
  }
}
