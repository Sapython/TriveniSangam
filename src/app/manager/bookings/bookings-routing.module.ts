import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillingComponent } from './billing/billing.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { BookingsComponent } from './bookings.component';

const routes: Routes = [
  { path: '', component: BookingsComponent },
  { path: 'booking-details', component: BookingDetailsComponent },
  { path: 'billing', component: BillingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingsRoutingModule {}
