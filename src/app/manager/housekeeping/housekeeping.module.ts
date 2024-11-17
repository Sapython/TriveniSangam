import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HousekeepingRoutingModule } from './housekeeping-routing.module';
import { HousekeepingComponent } from './housekeeping.component';
import { HousekeepingCardComponent } from './housekeeping-card/housekeeping-card.component';


@NgModule({
  declarations: [
    HousekeepingComponent,
    HousekeepingCardComponent
  ],
  imports: [
    CommonModule,
    HousekeepingRoutingModule
  ]
})
export class HousekeepingModule { }
