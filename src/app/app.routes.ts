import { Routes } from '@angular/router';
import { OrdersListComponent } from './pages/protected/orders/orders-list.component';
import { OrderDetailsComponent } from './pages/protected/orders/order-details.component';
import { CheckoutComponent } from './pages/protected/checkout/checkout.component';
import { CartComponent } from './pages/protected/cart/cart.component';

export const routes: Routes = [
  { path: 'cart', component: CartComponent },
  { path: 'orders', component: OrdersListComponent },
  { path: 'orders/:id', component: OrderDetailsComponent },
  { path: 'checkout', component: CheckoutComponent },
];
