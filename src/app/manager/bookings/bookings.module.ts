import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingsRoutingModule } from './bookings-routing.module';
import { BookingsComponent } from './bookings.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { BillingComponent } from './billing/billing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddMemberModalComponent } from './add-member-modal/add-member-modal.component';
import {MatDialogModule} from '@angular/material/dialog'; 
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    BookingsComponent,
    BookingDetailsComponent,
    BillingComponent,
    AddMemberModalComponent
  ],
  imports: [
    CommonModule,
    BookingsRoutingModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatButtonModule
  ]
})
export class BookingsModule { }
