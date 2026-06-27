import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-terms',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './terms.html',
  styleUrl: './terms.css',
})
export class Terms {
  sections = Array.from({ length: 13 }, (_, i) => i + 1);
}
