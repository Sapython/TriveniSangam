import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuestsRoutingModule } from './guests-routing.module';
import { GuestsComponent } from './guests.component';
import { CreateNewGuestComponent } from './create-new-guest/create-new-guest.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    GuestsComponent,
    CreateNewGuestComponent
  ],
  imports: [
    CommonModule,
    GuestsRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class GuestsModule { }
