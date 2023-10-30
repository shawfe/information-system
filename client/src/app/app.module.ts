import { NgModule } from '@angular/core';
import {
  TranslateModule,
  TranslateLoader,
  MissingTranslationHandler,
  MissingTranslationHandlerParams
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import localeEn from '@angular/common/locales/en';
import localeRu from '@angular/common/locales/ru';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QuillModule } from 'ngx-quill';
import { MaterialModule } from '@shared/material.module';
import { AuthService, AUTH_TOKEN } from './auth/auth.service';
import { UsersModule } from './users/users.module';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { SharedModule } from '@shared/shared.module';
import { ApiInterceptor } from './api.interceptor';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AuthGuard } from './auth/auth.guard';
import { EmailConfirmationModule } from './components/email-confirmation/email-confirmation.module';
import { MainPageModule } from './components/main-page/main-page.module';
import { EditorModule } from './components/editor/editor.module';
import { MainPageGuard } from './components/main-page/main-page.guard';
import { ToolbarModule } from './components/toolbar/toolbar.module';
import { ApplicationService } from './app.service';
import { registerLocaleData } from '@angular/common';
import { AdminGuard } from './admin/admin.guard';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrModule } from 'ngx-toastr';

export function jwtOptionsFactory() {
  return {
    tokenGetter: () => window.localStorage.getItem(AUTH_TOKEN),
    headerName: 'Authorization'
  };
}

registerLocaleData(localeEn);
registerLocaleData(localeRu);

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/locale/', '.json');
}

export class MissingTranslationService implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    return `WARN: '${params.key}' is missing in '${params.translateService.currentLang}' locale`;
  }
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    QuillModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    SharedModule,
    EditorModule,
    ToolbarModule,
    MatProgressSpinnerModule,
    OverlayModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory
      }
    }),

    UsersModule.forRoot(),
    EmailConfirmationModule,
    MainPageModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,

        deps: [HttpClient]
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: MissingTranslationService
      },
      useDefaultLang: false
    }),
    ToastrModule.forRoot()
  ],
  providers: [
    ApplicationService,
    AuthService,
    AuthGuard,
    MainPageGuard,
    AdminGuard,
    AuthInterceptor,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
