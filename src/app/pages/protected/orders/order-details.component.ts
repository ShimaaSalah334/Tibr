import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { DatePipe, CurrencyPipe, CommonModule } from '@angular/common';
import { Order } from '../../../core/interfaces/order.interface';
import { OrdersService } from '../../../core/services/orders.service';
import { StatusBadgeComponent } from '../../../shared/components/ui/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../shared/components/ui/loading-spinner/loading-spinner.component';
import { OrderItemsTableComponent } from '../../../shared/components/business/order-items-table/order-items-table.component';
import { ReviewResponse, ReviewService } from '../../../core/services/review.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-order-details',
  imports: [
    RouterLink,
    DatePipe,
    CurrencyPipe,
    FormsModule,
    CommonModule, ReactiveFormsModule,
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
  public i18n = inject(I18nService);
  private reviewService=inject(ReviewService);
  
  order: Order | null = null;
  isLoading = true;
  error: string | null = null;
  paymentNotification: { type: 'success' | 'failed'; message: string } | null = null;
  private orderId = '';

  review: ReviewResponse | null = null;
  ratingValue: number = 5;
  reviewDescription: string = '';
  hoveredRating: number = 0;
  isSubmitting: boolean = false;
  errorMessage: string = '';

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id') ?? '';
    if (!this.orderId) {
      this.error = this.i18n.translate('orders.invalidOrderId', 'Invalid order ID.');
      this.isLoading = false;
      return;
    }

    const payment = this.route.snapshot.queryParamMap.get('payment');
    if (payment === 'success') {
      this.paymentNotification = {
        type: 'success',
        message: this.i18n.translate('orders.paymentSuccess', 'Payment successful! Your order has been confirmed.')
      };
      this.router.navigate([], { queryParams: { payment: undefined }, queryParamsHandling: 'merge' });
    } else if (payment === 'failed') {
      this.paymentNotification = {
        type: 'failed',
        message: this.i18n.translate('orders.paymentFailed', 'Payment failed. Please try again.')
      };
      this.router.navigate([], { queryParams: { payment: undefined }, queryParamsHandling: 'merge' });
    }

    this.loadOrder();

    this.loadOrderAndReview();
  }
loadOrderAndReview() {
    this.reviewService.getReviewByOrderId(Number(this.orderId)).subscribe({
      next: (reviews) => {
        this.review = reviews ? reviews : null;
      },
      error: (err) => console.error('خطأ في جلب التقييم', err)
    });
  }

  setRating(value: number) {
    this.ratingValue = value;
  }
  submitReview() {
    if (this.ratingValue < 1 || this.ratingValue > 5) return;
    
    this.isSubmitting = true;
    this.errorMessage = '';

    const payload = {
      orderId: Number(this.orderId),
      value: this.ratingValue,
      description: this.reviewDescription
    };

    this.reviewService.createReview(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.loadOrderAndReview(); 
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'حدث خطأ أثناء إرسال التقييم.';
      }
    });
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
        this.error = this.i18n.translate('orders.loadError', 'Failed to load order details. Please try again.');
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
          this.error = this.i18n.translate('orders.cancelError', 'Failed to cancel order. Please try again.');
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
