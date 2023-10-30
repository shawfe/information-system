import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { AppSectionType, BOOK_SECTION_ROUTES } from 'app/models/book.data';
import { StateManagerAppService } from 'app/state-manger/state.manager.app.service';
import { filter, Observable, Subject, takeUntil } from 'rxjs';

@Injectable()
export class ToolbarService {
  private _unsubscribe: Subject<void>;

  constructor(private _router: Router, private _stateManagerAppService: StateManagerAppService) {}

  init(): void {
    this._unsubscribe = new Subject<void>();
    this._checkUrl(this._router.url);
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntil(this._unsubscribe)
      )
      .subscribe((event: NavigationStart) => {
        this._checkUrl(event.url);
      });
  }

  destroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  public getActiveBookSectionObservable(): Observable<AppSectionType> {
    return this._stateManagerAppService.getActiveAppSectionObservable();
  }

  private _checkUrl(url: string) {
    switch (true) {
      case url.includes(BOOK_SECTION_ROUTES.JAVASCRIPT): {
        if (this._stateManagerAppService.getActiveAppSection() !== 'JAVASCRIPT') {
          this._stateManagerAppService.setActiveAppSection('JAVASCRIPT');
        }
        break;
      }

      case url.includes(BOOK_SECTION_ROUTES.TYPESCRIPT): {
        if (this._stateManagerAppService.getActiveAppSection() !== 'TYPESCRIPT') {
          this._stateManagerAppService.setActiveAppSection('TYPESCRIPT');
        }
        break;
      }

      default: {
        this._stateManagerAppService.setActiveAppSection(null);
      }
    }
  }
}
