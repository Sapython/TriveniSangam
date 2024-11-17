import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HousekeepingComponent } from './housekeeping.component';

const routes: Routes = [{ path: '', component: HousekeepingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HousekeepingRoutingModule { }
