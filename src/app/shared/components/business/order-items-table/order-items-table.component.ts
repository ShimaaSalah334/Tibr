import { Component, inject, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { OrderItem } from '../../../../core/interfaces/order.interface';
import { I18nService } from '../../../../core/services/i18n.service';

@Component({
  selector: 'app-order-items-table',
  imports: [CurrencyPipe],
  templateUrl: './order-items-table.component.html',
  styleUrl: './order-items-table.component.css',
})
export class OrderItemsTableComponent {
  @Input({ required: true }) items!: OrderItem[];
  public i18n = inject(I18nService);

}
