import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
interface TrustPoint {
  icon: string;
  heading: string;
  text: string;
}
@Component({
  selector: 'app-about',
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
trustPoints: TrustPoint[] = [
    {
      icon: 'bi bi-shield-check',
      heading: 'Fully Verified Storage',
      text: 'Your assets are allocated in institutional-grade vaults with regular independent audits.'
    },
    {
      icon: 'bi bi-lightning-charge',
      heading: 'Instant Execution',
      text: 'Buy, liquidate, or trade instantly 24/7 without delays or hidden liquidity cuts.'
    },
    {
      icon: 'bi bi-cpu',
      heading: 'AI-Powered Precision Analytics',
      text: 'Gain real-time insights on your investments with smart tools customized for raw gold and silver markets.'
    }
  ];
}
