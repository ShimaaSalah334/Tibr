import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {}