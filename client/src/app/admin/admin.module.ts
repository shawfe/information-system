import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin.routing.module';
import { AdminService } from './admin.service';
import { MatIconModule } from '@angular/material/icon';
import { ToolbarModule } from 'app/components/toolbar/toolbar.module';
import { UserRegistrationModule } from './user-registration/user-registration.module';
import { BookEditingModule } from './book-editing/book-editing.module';
import { PortalModule } from '@angular/cdk/portal';
import { TaskModifyingModule } from './task-modifying/task-modifying.module';
import { UserEditingModule } from './user-editing/user-editing.module';
import { UserResultsModule } from './user-results/user-results.module';
import { StateManagerAdminService } from './state.manager.admin.service';
import { MatTableModule } from '@angular/material/table';
import { ConfirmDialogModule } from 'app/components/confirm-dialog/confirm-dialog.module';
import { RenameDialogModule } from 'app/components/rename-dialog/rename-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    AdminRoutingModule,
    TranslateModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    PortalModule,
    MatTableModule,

    ToolbarModule,
    UserRegistrationModule,
    BookEditingModule,
    TaskModifyingModule,
    UserEditingModule,
    UserResultsModule,
    ConfirmDialogModule.forRoot(),
    RenameDialogModule.forRoot()
  ],
  exports: [],
  declarations: [AdminComponent],
  providers: [AdminService, StateManagerAdminService]
})
export class AdminModule {}
