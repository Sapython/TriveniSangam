import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './layouts/header/header.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrdersComponent } from './orders/orders.component';
import { ProductsComponent } from './products/products.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { ProfileComponent } from './profile/profile.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    DashboardComponent,
    OrdersComponent,
    ProductsComponent,
    FeedbackComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: 'dashboard', component : DashboardComponent },
      { path: 'orders', component : OrdersComponent },
      { path: 'products', component : ProductsComponent },
      { path: 'feedbacks', component : FeedbackComponent },
      { path: 'profile', component : ProfileComponent },
      { path: '', component : DashboardComponent, },
])
  ]
})
export class VendorModule { }
