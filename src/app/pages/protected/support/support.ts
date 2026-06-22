import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupportService } from '../../../core/services/support.service';
import { CreateSupportDto } from '../../../core/interfaces/support';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-support-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './support.html',
  styleUrls: ['./support.css']
})
export class Support {
  supportForm!: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private supportService: SupportService,
    public i18n: I18nService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.supportForm = this.fb.group({
      // Simulating a logged-in user ID. Replace with actual auth user ID.
      userId: [Number(localStorage.getItem('userId')), [Validators.required]],
      subject: ['', [Validators.required, Validators.maxLength(200)]]
    });
  }

  onSubmit(): void {
    if (this.supportForm.invalid) {
      this.supportForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    const requestData: CreateSupportDto = this.supportForm.value;

    this.supportService.createSupport(requestData).subscribe({
      next: () => {
        this.successMessage = this.i18n.translate('support.success', 'Support ticket created successfully!');
        this.supportForm.get('subject')?.reset(); // Reset just the subject line
        this.isSubmitting = false;
      },
      error: (error: any) => {
        this.errorMessage = error.error || this.i18n.translate('support.errorFallback', 'Something went wrong. Please try again.');
        this.isSubmitting = false;
      }
    });
  }
}
