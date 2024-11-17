import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PendingProductsComponent } from './pending-products/pending-products.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './layouts/header/header.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { OrdersComponent } from './orders/orders.component';
import { ProductsComponent } from './products/products.component';
import { ViewOrderComponent } from './view-order/view-order.component';
import { CustomersComponent } from './customers/customers.component';
import { FeedbacksComponent } from './feedbacks/feedbacks.component';
import { CustomerIssuesComponent } from './customer-issues/customer-issues.component';
import { VendorsComponent } from './vendors/vendors.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { RoomsComponent } from './rooms/rooms.component';
import { AddRoomComponent } from './rooms/add-room/add-room.component';
import { MaterialModule } from '../users/layouts/material/material.module';
import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
  declarations: [
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    OrdersComponent,
    ProductsComponent,
    ViewOrderComponent,
    CustomersComponent,
    PendingProductsComponent,
    FeedbacksComponent, CustomerIssuesComponent, VendorsComponent, AddProductComponent, RoomsComponent, AddRoomComponent
  ],
  imports: [
    CommonModule,
    GoogleMapsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
          { path: 'dashboard', component : DashboardComponent },
          { path: 'orders', component : OrdersComponent },
          { path: 'products',
            children:[
              { path : '', component: ProductsComponent},
              {path: 'add', component : AddProductComponent },
            ]
          },
          {path:'rooms',
            children:[
              { path : '', component: RoomsComponent},
              {path: 'add', component : AddRoomComponent },
              {path: 'update/:id', component : AddRoomComponent },
            ]
          },
          { path:'pending-products', component:PendingProductsComponent},
          { path: 'orders/view', component : ViewOrderComponent},
          { path: 'customers', component : CustomersComponent},
          { path: 'feedbacks', component : FeedbacksComponent },
          { path: 'customer-issues', component : CustomerIssuesComponent},
          { path: 'vendors', component : VendorsComponent},
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]),
    MaterialModule
  ],
  exports : [
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    OrdersComponent,
    ProductsComponent,
    ViewOrderComponent,
    CustomersComponent,
    PendingProductsComponent,
    FeedbacksComponent, CustomerIssuesComponent, VendorsComponent, AddProductComponent, RoomsComponent, AddRoomComponent
  ]
})
export class AdminModule { }
