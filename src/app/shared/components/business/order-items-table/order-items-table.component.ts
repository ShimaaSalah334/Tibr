import { Component, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { OrderItem } from '../../../../core/interfaces/order.interface';

@Component({
  selector: 'app-order-items-table',
  imports: [CurrencyPipe],
  templateUrl: './order-items-table.component.html',
  styleUrl: './order-items-table.component.css',
})
export class OrderItemsTableComponent {
  @Input({ required: true }) items!: OrderItem[];
}
