import { animate, state, style, transition, trigger } from '@angular/animations';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminPageType } from 'app/models/admin.data';
import { Observable } from 'rxjs';
import { AdminService } from './admin.service';
import { BookEditingComponent } from './book-editing/book-editing.component';
import { StateManagerAdminService } from './state.manager.admin.service';
import { TaskModifyingComponent } from './task-modifying/task-modifying.component';
import { UserEditingComponent } from './user-editing/user-editing.component';
import { UserResultsComponent } from './user-results/user-results.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';

@Component({
  selector: 'admin',
  templateUrl: 'admin.component.html',
  styleUrls: ['./admin.component.scss'],
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
export class AdminComponent implements OnInit, OnDestroy {
  public adminActiveType$: Observable<AdminPageType>;
  public adminPortal$: Observable<ComponentPortal<any>>;

  constructor(
    private _adminService: AdminService,
    private _stateManagerAdminService: StateManagerAdminService
  ) {}

  ngOnInit(): void {
    this.adminPortal$ = this._adminService.getAdminPortalObservable();
    this.adminActiveType$ = this._stateManagerAdminService.getAdminPageTypeObservable();
    this._adminService.setAdminPortal(new ComponentPortal(UserRegistrationComponent));
  }

  ngOnDestroy(): void {
    this._adminService.clearPortal();
  }

  public onAdminNavigationClick(type: AdminPageType): void {
    this._stateManagerAdminService.setAdminPageType(type);
    switch (type) {
      case 'USER_REGISTRATION': {
        this._adminService.setAdminPortal(new ComponentPortal(UserRegistrationComponent));
        break;
      }
      case 'USER_EDITING': {
        this._adminService.setAdminPortal(new ComponentPortal(UserEditingComponent));
        break;
      }

      case 'BOOK_EDITING': {
        this._adminService.setAdminPortal(new ComponentPortal(BookEditingComponent));
        break;
      }

      case 'TASK_ADDING': {
        this._adminService.setAdminPortal(new ComponentPortal(TaskModifyingComponent));
        break;
      }
      case 'TASK_EDITING': {
        this._adminService.setAdminPortal(new ComponentPortal(TaskModifyingComponent));
        break;
      }
      case 'USER_RESULTS': {
        this._adminService.setAdminPortal(new ComponentPortal(UserResultsComponent));
        break;
      }

      default: {
        this._adminService.clearPortal();
      }
    }
  }

  public onLogoutClick(): void {
    this._adminService.initiateLogout();
  }
}
