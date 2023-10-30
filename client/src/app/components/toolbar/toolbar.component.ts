import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'app/auth/auth.service';
import { AppSectionType, BOOK_SECTION_ROUTES } from 'app/models/book.data';
import { UsersService } from 'app/users/users.service';
import { Observable } from 'rxjs';
import { ToolbarService } from './toolbar.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, OnDestroy {
  public filteredContentLinks = [];

  public searchControl = new FormControl('');
  public activeBookSection$: Observable<AppSectionType>;
  public isAdmin = false;

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _toolbarService: ToolbarService,
    private _usersService: UsersService
  ) {}

  ngOnInit(): void {
    this._toolbarService.init();
    this.activeBookSection$ = this._toolbarService.getActiveBookSectionObservable();
    this.isAdmin = this._usersService.getCurrentUser().accountType === 'ADMIN';
  }

  ngOnDestroy(): void {
    this._toolbarService.destroy();
  }

  public onNavigationClick(navigationType: AppSectionType) {
    this._router.navigate([BOOK_SECTION_ROUTES[navigationType]]);
  }

  public onLogout(): void {
    this._authService.logout();
  }
}
