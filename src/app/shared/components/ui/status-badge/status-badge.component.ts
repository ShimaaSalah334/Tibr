import { Component, Input, inject } from '@angular/core';
import { I18nService } from '../../../../core/services/i18n.service';

@Component({
  selector: 'app-status-badge',
  imports: [],
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.css',
})
export class StatusBadgeComponent {
  @Input({ required: true }) label!: string;
  private i18n = inject(I18nService);

  get translatedLabel(): string {
    const statusMap: Record<string, string> = {
      'Pending': 'status.pending',
      'Confirmed': 'status.confirmed',
      'Processing': 'status.processing',
      'Shipped': 'status.shipped',
      'Delivered': 'status.delivered',
      'Cancelled': 'status.cancelled',
      'Paid': 'status.paid',
      'Failed': 'status.failed',
      'Refunded': 'status.refunded',
    };
    const key = statusMap[this.label];
    return key ? this.i18n.translate(key, this.label) : this.label;
  }

  get badgeClass(): string {
    const map: Record<string, string> = {
      Pending: 'bg-warning text-dark',
      Confirmed: 'bg-info text-dark',
      Processing: 'bg-info text-dark',
      Shipped: 'bg-primary',
      Delivered: 'bg-success',
      Cancelled: 'bg-danger',
      Paid: 'bg-success',
      Failed: 'bg-danger',
      Refunded: 'bg-secondary',
    };
    return `badge ${map[this.label] || 'bg-secondary'}`;
  }
}
