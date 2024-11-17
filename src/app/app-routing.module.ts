import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';
import { EnsureAdminService } from './services/ensure-admin.service';
import { EnsureAuthenticated } from './services/ensure-authenticated.service';
import { EnsureVendorService } from './services/ensure-vendor.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./users/users.module').then((m) => m.UsersModule),
  },
  {
    path: 'ProductManager',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
    // canActivate: [AdminGuard],
  },
  {
    path: 'RoomManager',
    loadChildren: () =>
      import('./manager/manager.module').then((m) => m.ManagerModule),
  },
  {
    path: 'vendor',
    loadChildren: () => import('./vendor/vendor.module')
    .then(m => m.VendorModule),
    // canActivate:[EnsureAuthenticated, EnsureVendorService]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
