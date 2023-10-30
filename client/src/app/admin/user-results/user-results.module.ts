import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';

import { UserResultsComponent } from './user-results.component';
import { UserResultsService } from './user-results.service';

@NgModule({
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    MatProgressBarModule,
    TranslateModule,
    MatIconModule,
    MatExpansionModule
  ],
  declarations: [UserResultsComponent],
  providers: [UserResultsService]
})
export class UserResultsModule {}
