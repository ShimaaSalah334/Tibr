import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/noAuth.guard';

export const routes: Routes = [
  // ==========================================
  // 1. المسارات العامة (Guest Routes) - Lazy Loaded
  // ==========================================
  { 
    path: '', 
    loadComponent: () => import('./pages/guest/home/home').then(m => m.Home), 
    pathMatch: 'full' 
  },
  { 
    path: 'products', 
    loadComponent: () => import('./pages/guest/products/products').then(m => m.Products) 
  },
  { 
    path: 'products/:id', 
    loadComponent: () => import('./pages/guest/product-details/product-details').then(m => m.ProductDetails) 
  },
  { 
    path: 'how-it-works', 
    loadComponent: () => import('./pages/guest/how-it-works/how-it-works').then(m => m.HowItWorks) 
  },
  { 
    path: 'team-tibr', 
    loadComponent: () => import('./pages/guest/team-tibr/team-tibr').then(m => m.TeamTibr) 
  },
  { 
    path: 'about', 
    loadComponent: () => import('./pages/guest/about/about').then(m => m.About) 
  },

  // ==========================================
  // 2. مسارات المصادقة - تمنع المستخدم المسجل من الدخول مجدداً
  // ==========================================
  {
    path: '',
    canActivate: [noAuthGuard],
    children: [
      { 
        path: 'login', 
        loadComponent: () => import('./pages/auth/login/login').then(m => m.Login) 
      },
      { 
        path: 'register', 
        loadComponent: () => import('./pages/auth/register/register').then(m => m.Register) 
      },
      { 
        path: 'verfiy-account', 
        loadComponent: () => import('./pages/auth/verfiy-account/verfiy-account').then(m => m.VerfiyAccount) 
      },
      { 
        path: 'verfiy-kyc', 
        loadComponent: () => import('./pages/auth/verfiy-kyc/verfiy-kyc').then(m => m.VerfiyKYC) 
      },
      { 
        path: 'forget-password', 
        loadComponent: () => import('./pages/auth/forget-password/forget-password').then(m => m.ForgetPassword) 
      },
      { 
        path: 'reset-password', 
        loadComponent: () => import('./pages/auth/reast-password/reast-password').then(m => m.ReastPassword) 
      },
    ],
  },

  // ==========================================
  // 3. المسارات المحمية (Protected Routes) - تحتاج تسجيل دخول
  // ==========================================
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { 
        path: 'cart', 
        loadComponent: () => import('./pages/protected/cart/cart.component').then(m => m.CartComponent) 
      },
      { 
        path: 'wishlist', 
        loadComponent: () => import('./pages/protected/favorite/favorite/favorite').then(m => m.Favorite) 
      },
      { 
        path: 'orders', 
        loadComponent: () => import('./pages/protected/orders/orders-list.component').then(m => m.OrdersListComponent) 
      },
      { 
        path: 'orders/:id', 
        loadComponent: () => import('./pages/protected/orders/order-details.component').then(m => m.OrderDetailsComponent) 
      },
      { 
        path: 'wallet', 
        loadComponent: () => import('./pages/protected/wallet/wallet').then(m => m.Wallet) 
      },
      { 
        path: 'help', 
        loadComponent: () => import('./pages/protected/support/support').then(m => m.Support) 
      },
      { 
        path: 'profile', 
        loadComponent: () => import('./pages/protected/profile/profile').then(m => m.Profile) 
      },
      { 
        path: 'withdraw-funds', 
        loadComponent: () => import('./pages/protected/withdraw-funds/withdraw-funds').then(m => m.WithdrawFunds) 
      },
      { 
        path: 'depositing-funds', 
        loadComponent: () => import('./pages/protected/depositing-funds/depositing-funds').then(m => m.DepositingFunds) 
      },
      { 
        path: 'investment-strategy', 
        loadComponent: () => import('./pages/protected/investment-strategy/investment-strategy').then(m => m.InvestmentStrategy) 
      },
      { 
        path: 'buying-metals', 
        loadComponent: () => import('./pages/protected/buying-metals/buying-metals').then(m => m.BuyingMetals) 
      },
      { 
        path: 'selling-metals', 
        loadComponent: () => import('./pages/protected/selling-metals/selling-metals').then(m => m.SellingMetals) 
      },
      { 
        path: 'delivery', 
        loadComponent: () => import('./pages/protected/delivery/delivery').then(m => m.Delivery) 
      },
      { 
        path: 'ai-academy', 
        loadComponent: () => import('./pages/protected/ai-academy-component/ai-academy-component').then(m => m.AiAcademyComponent) 
      },
      { 
        path: 'financial-advisor', 
        loadComponent: () => import('./pages/protected/financial-advisor/financial-advisor').then(m => m.FinancialAdvisor) 
      },
      { 
        path: 'checkout', 
        loadComponent: () => import('./pages/protected/checkout/checkout.component').then(m => m.CheckoutComponent) 
      },
      { 
        path: 'payment/callback/response', 
        loadComponent: () => import('./pages/protected/payment-callback-component/payment-callback-component').then(m => m.PaymentCallbackComponent) 
      },
    ],
  },

  // إعادة التوجيه لأي مسار عشوائي غير موجود
  { path: '**', redirectTo: '' },
];