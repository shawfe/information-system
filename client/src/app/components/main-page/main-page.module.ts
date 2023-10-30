import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MainPageComponent } from './main-page.component';
import { MainPageRoutingModule } from './main-page.routing.module';
import { MainPageService } from './main-page.service';

@NgModule({
  imports: [CommonModule, MainPageRoutingModule],
  providers: [MainPageService],
  declarations: [MainPageComponent]
})
export class MainPageModule {}
