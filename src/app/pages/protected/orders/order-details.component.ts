import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Order } from '../../../core/interfaces/order.interface';
import { OrdersService } from '../../../core/services/orders.service';
import { StatusBadgeComponent } from '../../../shared/components/ui/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../shared/components/ui/loading-spinner/loading-spinner.component';
import { OrderItemsTableComponent } from '../../../shared/components/business/order-items-table/order-items-table.component';

@Component({
  selector: 'app-order-details',
  imports: [
    RouterLink,
    DatePipe,
    CurrencyPipe,
    FontAwesomeModule,
    StatusBadgeComponent,
    LoadingSpinnerComponent,
    OrderItemsTableComponent,
  ],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css',
})
export class OrderDetailsComponent implements OnInit {
  private ordersService = inject(OrdersService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  order: Order | null = null;
  isLoading = true;
  error: string | null = null;
  paymentNotification: { type: 'success' | 'failed'; message: string } | null = null;
  private orderId = 0;

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(this.orderId) || this.orderId <= 0) {
      this.error = 'Invalid order ID.';
      this.isLoading = false;
      return;
    }

    const payment = this.route.snapshot.queryParamMap.get('payment');
    if (payment === 'success') {
      this.paymentNotification = { type: 'success', message: 'Payment successful! Your order has been confirmed.' };
      this.router.navigate([], { queryParams: { payment: undefined }, queryParamsHandling: 'merge' });
    } else if (payment === 'failed') {
      this.paymentNotification = { type: 'failed', message: 'Payment failed. Please try again.' };
      this.router.navigate([], { queryParams: { payment: undefined }, queryParamsHandling: 'merge' });
    }

    this.loadOrder();
  }

  loadOrder(): void {
    this.isLoading = true;
    this.error = null;
    this.ordersService.getOrder(this.orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load order details. Please try again.';
        this.isLoading = false;
      },
    });
  }

  cancelOrder(): void {
    if (!this.order) return;
    if (!confirm('Are you sure you want to cancel this order?')) return;
    this.ordersService
      .updateOrder(this.order.id, { orderStatus: 'Cancelled' })
      .subscribe({
        next: (updated) => {
          this.order = updated;
        },
        error: () => {
          this.error = 'Failed to cancel order. Please try again.';
        },
      });
  }

  get canCancel(): boolean {
    return (
      this.order !== null &&
      (this.order.orderStatus === 'Pending' ||
        this.order.orderStatus === 'Confirmed')
    );
  }
}
