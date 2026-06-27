import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-privacy',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './privacy.html',
  styleUrl: './privacy.css',
})
export class Privacy {
  sections = Array.from({ length: 10 }, (_, i) => i + 1);
}
