import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { VerfiyAccount } from './pages/auth/verfiy-account/verfiy-account';
import { VerfiyKYC } from './pages/auth/verfiy-kyc/verfiy-kyc';
import { ForgetPassword } from './pages/auth/forget-password/forget-password';
import { ReastPassword } from './pages/auth/reast-password/reast-password';
import { OrdersListComponent } from './pages/protected/orders/orders-list.component';
import { OrderDetailsComponent } from './pages/protected/orders/order-details.component';
import { CheckoutComponent } from './pages/protected/checkout/checkout.component';
import { App } from './app';

export const routes: Routes = [
  {
    path: '',
    component: App,
    pathMatch: 'full'
  },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'verfiy-account', component: VerfiyAccount },
  { path: 'verfiy-kyc', component: VerfiyKYC },
  { path: 'forget-password', component: ForgetPassword },
  { path: 'reset-password', component: ReastPassword },
  { path: 'orders', component: OrdersListComponent },
  { path: 'orders/:id', component: OrderDetailsComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: '**', redirectTo: '' }
];
