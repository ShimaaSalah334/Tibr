import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Step {
  icon: string;
  title: string;
  description: string;
}
@Component({
  selector: 'app-how-it-works',
  imports: [CommonModule],
  templateUrl: './how-it-works.html',
  styleUrl: './how-it-works.css',
})
export class HowItWorks {
steps: Step[] = [
    {
      icon: 'bi bi-person-plus',
      title: 'Create Account',
      description: 'Sign up securely in minutes. Complete a simple verification process to get started.'
    },
    {
      icon: 'bi bi-wallet2',
      title: 'Fund Your Wallet',
      description: 'Connect your preferred payment method and add capital to your investment dashboard easily.'
    },
    {
      icon: 'bi bi-gem',
      title: 'Select Asset',
      description: 'Browse our fully verified gold and silver assets and choose the allocation that fits your goals.'
    },
    {
      icon: 'bi bi-graph-up-arrow',
      title: 'Monitor & Grow',
      description: 'Track your real-time analytics, instant execution status, and watch your physical wealth compound.'
    }
  ];
}
