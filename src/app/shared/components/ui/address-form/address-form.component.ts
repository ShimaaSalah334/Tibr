import { Component, inject, Output, EventEmitter } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '../../../pipes/translate.pipe';

@Component({
  selector: 'app-address-form',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.css',
})
export class AddressFormComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    street: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zip: ['', Validators.required],
    country: ['', Validators.required],
  });

  @Output() valueChange = new EventEmitter<typeof this.form.value>();
}
