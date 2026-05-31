import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  imports: [],
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.css',
})
export class StatusBadgeComponent {
  @Input({ required: true }) label!: string;

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
