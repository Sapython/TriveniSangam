import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './layouts/header/header.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { HomepageComponent } from './homepage/homepage.component';
import { SingleDishComponent } from './single-dish/single-dish.component';
import { CategoryPageComponent } from './category-page/category-page.component';
import { CartComponent } from './cart/cart.component';
import { RoomsComponent } from './rooms/rooms.component';
import { SingleRoomComponent } from './rooms/single-room/single-room.component';
import { CheckoutComponent } from './cart/checkout/checkout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactusComponent } from './contactus/contactus.component';
import { OrderDetailsComponent } from './cart/checkout/order-details/order-details.component';
import { TrackOrderComponent } from './cart/checkout/track-order/track-order.component';
import { LoginComponent } from './login/login.component';
import { SwiperModule } from 'swiper/angular';
import { MaterialModule } from './layouts/material/material.module';
import { UsersRoutingModule } from './users-routing.module';
import { DataProvider } from '../providers/data.provider';
import { WishlistComponent } from './wishlist/wishlist.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ReturnPolicyComponent } from './return-policy/return-policy.component';
import { SupportComponent } from './support/support.component';
import { FaqPageComponent } from './faq-page/faq-page.component';
import { AccountComponent } from './account/account.component';
import { YourAddressComponent } from './account/your-address/your-address.component';
import { MyOrdersComponent } from './account/my-orders/my-orders.component';
import { VerifyEmailComponent } from './login/verify-email/verify-email.component';
import { NotFoundPageComponent } from './layouts/not-found-page/not-found-page.component';
import { Error500PageComponent } from './layouts/error500-page/error500-page.component';
import { Error508PageComponent } from './layouts/error508-page/error508-page.component';
import { CompsModule } from '../components/comps.module';
import { MatButtonModule } from '@angular/material/button';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { FeedbacksComponent } from './feedbacks/feedbacks.component';
import { GiveFeedbackComponent } from './give-feedback/give-feedback.component';
import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    HomepageComponent,
    SingleDishComponent,
    CategoryPageComponent,
    CartComponent,
    RoomsComponent,
    SingleRoomComponent,
    CheckoutComponent,
    ContactusComponent,
    OrderDetailsComponent,
    TrackOrderComponent,
    LoginComponent,
    WishlistComponent,
    TermsConditionsComponent,
    PrivacyPolicyComponent,
    ReturnPolicyComponent,
    SupportComponent,
    FaqPageComponent,
    AccountComponent,
    YourAddressComponent,
    MyOrdersComponent,
    VerifyEmailComponent,
    NotFoundPageComponent,
    Error500PageComponent,
    Error508PageComponent,
    DisclaimerComponent,
    FeedbacksComponent,
    GiveFeedbackComponent,
  ],
  imports: [
    CommonModule,
    CompsModule,
    MatButtonModule,
    ReactiveFormsModule,
    SwiperModule,
    FormsModule,
    MaterialModule,
    UsersRoutingModule,
    RouterModule,
    GoogleMapsModule,
  ],
  providers: []
})
export class UsersModule {
}
