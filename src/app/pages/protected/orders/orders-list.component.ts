import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Order } from '../../../core/interfaces/order.interface';
import { OrdersService } from '../../../core/services/orders.service';
import { OrderCardComponent } from '../../../shared/components/business/order-card/order-card.component';
import { LoadingSpinnerComponent } from '../../../shared/components/ui/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-orders-list',
  imports: [
    FormsModule,
    RouterLink,
    OrderCardComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.css',
})
export class OrdersListComponent implements OnInit {
  private ordersService = inject(OrdersService);

  orders: Order[] = [];
  filteredOrders: Order[] = [];
  isLoading = true;
  error: string | null = null;
  selectedStatus = 'All';
  sortOrder: 'newest' | 'oldest' = 'newest';

  readonly statuses = ['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.error = null;
    this.ordersService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load orders. Please try again.';
        this.isLoading = false;
      },
    });
  }

  applyFilters(): void {
    let result = [...this.orders];
    if (this.selectedStatus !== 'All') {
      result = result.filter((o) => o.orderStatus === this.selectedStatus);
    }
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return this.sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    this.filteredOrders = result;
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  onSortChange(sort: string): void {
    this.sortOrder = sort as 'newest' | 'oldest';
    this.applyFilters();
  }
}
