import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';

import { ProfileRoutingModule } from './profile.routing.module';
import { ProfileComponent } from './profile.component';
import { ProfileService } from './profile.service';
import { ProfileDataComponent } from './profile-data/profile-data.component';
import { ProfileEmailComponent } from './profile-email/profile-email.component';
import { ProfilePasswordComponent } from './profile-password/profile-password.component';
import { ProfileOverviewComponent } from './profile-profile/profile-overview.component';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { CustomPaginatorIntl } from '@shared/services/custom-paginator.service';
import { ToolbarModule } from '../toolbar/toolbar.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    PortalModule,
    MatCardModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatTableModule,
    MatPaginatorModule,
    ToolbarModule,
    ReactiveFormsModule
  ],
  declarations: [
    ProfileComponent,
    ProfileDataComponent,
    ProfileEmailComponent,
    ProfileOverviewComponent,
    ProfilePasswordComponent
  ],
  providers: [ProfileService, { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }]
})
export class ProfileModule {}
