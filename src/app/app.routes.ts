import { Routes } from '@angular/router';
import { Home } from './pages/guest/home/home';
import { Products } from './pages/guest/products/products';
import { ProductDetails } from './pages/guest/product-details/product-details';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { VerfiyAccount } from './pages/auth/verfiy-account/verfiy-account';
import { VerfiyKYC } from './pages/auth/verfiy-kyc/verfiy-kyc';
import { ForgetPassword } from './pages/auth/forget-password/forget-password';
import { ReastPassword } from './pages/auth/reast-password/reast-password';
import { OrdersListComponent } from './pages/protected/orders/orders-list.component';
import { OrderDetailsComponent } from './pages/protected/orders/order-details.component';
import { CheckoutComponent } from './pages/protected/checkout/checkout.component';
import { CartComponent } from './pages/protected/cart/cart.component';
import { Favorite } from './pages/protected/favorite/favorite/favorite';
import { PaymentCallbackComponent } from './pages/protected/payment-callback-component/payment-callback-component';
import { Wallet } from './pages/protected/wallet/wallet';
import { Profile } from './pages/protected/profile/profile';
import { WithdrawFunds } from './pages/protected/withdraw-funds/withdraw-funds';
import { DepositingFunds } from './pages/protected/depositing-funds/depositing-funds';
import { InvestmentStrategy } from './pages/protected/investment-strategy/investment-strategy';
import { BuyingMetals } from './pages/protected/buying-metals/buying-metals';
import { SellingMetals } from './pages/protected/selling-metals/selling-metals';
import { Delivery } from './pages/protected/delivery/delivery';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    pathMatch: 'full'
  },
  { path: 'products', component: Products },
  { path: 'products/:id', component: ProductDetails },
  { path: 'cart', component: CartComponent },
  { path: 'wishlist', component: Favorite },
  // { path: 'dashboard', redirectTo: '' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'verfiy-account', component: VerfiyAccount },
  { path: 'verfiy-kyc', component: VerfiyKYC },
  { path: 'forget-password', component: ForgetPassword },
  { path: 'reset-password', component: ReastPassword },
  { path: 'orders', component: OrdersListComponent },
  { path: 'wallet', component: Wallet },
  { path: 'profile', component: Profile },
  { path: 'withdraw-funds', component: WithdrawFunds },
  { path: 'depositing-funds', component: DepositingFunds },
  { path: 'investment-strategy', component: InvestmentStrategy },
  { path: 'buying-metals', component: BuyingMetals },
  { path: 'selling-metals', component: SellingMetals },
  { path: 'delivery', component: Delivery },
  { path: 'orders/:id', component: OrderDetailsComponent },
  { path: 'checkout', component: CheckoutComponent },
  {
  path: 'payment/callback/response',
  component: PaymentCallbackComponent
},
  { path: '**', redirectTo: '' }
];
