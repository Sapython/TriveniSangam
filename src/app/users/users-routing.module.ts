import { FaqPageComponent } from './faq-page/faq-page.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './cart/checkout/checkout.component';
import { OrderDetailsComponent } from './cart/checkout/order-details/order-details.component';
import { TrackOrderComponent } from './cart/checkout/track-order/track-order.component';
import { CategoryPageComponent } from './category-page/category-page.component';
import { ContactusComponent } from './contactus/contactus.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { RoomsComponent } from './rooms/rooms.component';
import { SingleDishComponent } from './single-dish/single-dish.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ReturnPolicyComponent } from './return-policy/return-policy.component';
import { AccountComponent } from './account/account.component';
import { YourAddressComponent } from './account/your-address/your-address.component';
import { VerifyEmailComponent } from './login/verify-email/verify-email.component';
import { MyOrdersComponent } from './account/my-orders/my-orders.component';
import { NotFoundPageComponent } from './layouts/not-found-page/not-found-page.component';
import { Error500PageComponent } from './layouts/error500-page/error500-page.component';
import { Error508PageComponent } from './layouts/error508-page/error508-page.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { EnsureAuthenticated } from '../services/ensure-authenticated.service';
import { FeedbacksComponent } from './feedbacks/feedbacks.component';
import { GiveFeedbackComponent } from './give-feedback/give-feedback.component';
import { LoginGuard } from '../guards/login.guard';

const routes: Routes = [
    { path: '', component: HomepageComponent },
    { path: 'view/:id', component: SingleDishComponent },
    { path: 'categories', component: SingleDishComponent },
    { path: 'cart', component: CartComponent, canActivate : [LoginGuard]  },
    { path: 'rooms', component : RoomsComponent},
    { path: 'checkout', component : CheckoutComponent, canActivate : [LoginGuard] },
    { path: 'contact-us', component: ContactusComponent },
    { path: 'category', component: CategoryPageComponent },
    { path: 'order', component: OrderDetailsComponent, canActivate : [LoginGuard] },
    { path: 'track-order', component: TrackOrderComponent, canActivate : [LoginGuard] },
    { path: 'sign-up', component: LoginComponent },
    { path: 'wishlist', component : WishlistComponent, canActivate : [LoginGuard]  },
    { path: 'terms-conditions', component : TermsConditionsComponent },
    { path: 'privacy-policy', component : PrivacyPolicyComponent },
    { path: 'return-policy', component : ReturnPolicyComponent },
    { path: 'faqs', component : FaqPageComponent },
    { path: 'account', component : AccountComponent, canActivate : [LoginGuard] },
    { path: 'account/my-orders', component : MyOrdersComponent, canActivate : [LoginGuard] },
    { path: 'disclaimer', component : DisclaimerComponent },
    { path: 'verify-email', component : VerifyEmailComponent, canActivate : [LoginGuard] },
    { path: 'account/addresses', component : YourAddressComponent, canActivate : [LoginGuard]  },
    { path: 'feedbacks', children : [
      { path : '' , component : FeedbacksComponent },
      { path : 'add', component : GiveFeedbackComponent }
    ]},
    { path : 'not-found', component : NotFoundPageComponent },
    { path : '500-error', component : Error500PageComponent },
    { path : '508-error', component : Error508PageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {
  constructor(){console.log('User routing module loaded');}
}
