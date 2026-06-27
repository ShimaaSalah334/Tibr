import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-about',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  trustPoints = Array.from({ length: 3 }, (_, i) => i + 1);
}
