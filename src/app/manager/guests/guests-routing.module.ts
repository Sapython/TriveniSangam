import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateNewGuestComponent } from './create-new-guest/create-new-guest.component';
import { GuestsComponent } from './guests.component';

const routes: Routes = [
  { path: '', component: GuestsComponent },
  { path: 'create-new-guest', component: CreateNewGuestComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuestsRoutingModule {}
