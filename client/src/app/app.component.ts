import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApplicationService } from './app.service';
import { StateManagerUserService } from './state-manger/state.manager.user.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public isCurrentUser$: Observable<boolean>;
  constructor(
    private _stateManagerUserService: StateManagerUserService,
    private _appService: ApplicationService,
    private _translateService: TranslateService
  ) {
    this.isCurrentUser$ = this._stateManagerUserService
      .getCurrentUserObservable()
      .pipe(map((user) => !!user));
    this._translateService.addLangs(environment.locales);
    this._translateService.use(environment.defaultLocale);
  }

  title = 'WIS';
}
