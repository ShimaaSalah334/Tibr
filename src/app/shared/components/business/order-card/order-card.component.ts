import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { Order } from '../../../../core/interfaces/order.interface';
import { StatusBadgeComponent } from '../../ui/status-badge/status-badge.component';

@Component({
  selector: 'app-order-card',
  imports: [RouterLink, StatusBadgeComponent, DatePipe, CurrencyPipe],
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.css',
})
export class OrderCardComponent {
  @Input({ required: true }) order!: Order;
}
