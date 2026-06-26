import { Component, computed, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.Service';
import { Router } from '@angular/router';
import { KYCPayload } from '../../../core/interfaces/kyc-payload';

@Component({
  selector: 'app-verfiy-kyc',
  imports: [ReactiveFormsModule],
  templateUrl: './verfiy-kyc.html',
  styleUrl: './verfiy-kyc.css',
})
export class VerfiyKYC implements OnInit {
  kycForm!: FormGroup;

  // إدارة وحفظ ملفات الوثائق والصورة الشخصية عبر السمنالز
  documentFrontFile = signal<File | null>(null);
  documentFrontName = signal<string | null>(null);
  documentBackFile = signal<File | null>(null);
  documentBackName = signal<string | null>(null);
  selfieFile = signal<File | null>(null);
  selfieFileName = signal<string | null>(null);
  
  // إدارة حالة إرسال استمارة البيانات الاستثمارية (idle | loading | success | error)
  formState = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  // رسائل الاستجابة والتحقق
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // حساب النسبة المئوية للمستثمر تلقائياً عبر ميزة الـ computed
  totalProgress = computed(() => {
    let base = 30; // النسبة الأساسية عند إتمام التفعيل السابق والوصول إلى هنا
    if (this.kycForm && this.kycForm.get('documentNumber')?.valid) base += 20;
    if (this.documentFrontName()) base += 15;
    if (this.documentBackName()) base += 15;
    if (this.selfieFileName()) base += 20;
    return Math.min(base, 100);
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.kycForm = this.fb.group({
      documentType: ['NATIONAL ID', [Validators.required]],
      documentNumber: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]] // تأكيد فحص الـ 14 رقم بالكامل للرقم القومي
    });

    // تفريغ الأخطاء تلقائياً عند إعادة الكتابة في الحقل
    this.kycForm.get('documentNumber')?.valueChanges.subscribe(() => {
      if (this.formState() === 'error') {
        this.formState.set('idle');
        this.errorMessage.set(null);
      }
    });
  }

  // تداول ومعالجة ملفات الهوية الأمامية/الخلفية والسيلفي بشكل آمن
  onFileSelected(event: Event, field: 'front' | 'back' | 'selfie'): void {
    const input = event.target as HTMLInputElement;
    this.errorMessage.set(null); // مسح أي أخطاء سابقة فور الاختيار الجديد
    
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // التأكد من حجم الملف (أقل من أو يساوي 5 ميجابايت)
      if (file.size <= 5 * 1024 * 1024) {
        if (field === 'front') {
          this.documentFrontFile.set(file);
          this.documentFrontName.set(file.name);
        } else if (field === 'back') {
          this.documentBackFile.set(file);
          this.documentBackName.set(file.name);
        } else {
          this.selfieFile.set(file);
          this.selfieFileName.set(file.name);
        }
      } else {
        // تحديث رسالة الخطأ المضمنة في الصفحة مباشرة دون اللجوء للمتصفح
        this.errorMessage.set('The size of the attached file exceeds the allowed limit (5 MB). Please choose a compressed asset.');
        
        if (field === 'front') {
          this.documentFrontFile.set(null);
          this.documentFrontName.set(null);
        } else if (field === 'back') {
          this.documentBackFile.set(null);
          this.documentBackName.set(null);
        } else {
          this.selfieFile.set(null);
          this.selfieFileName.set(null);
        }
      }
    }
  }

  // إرسال ومزامنة ملف الـ KYC للمراجعة الاستثمارية والبنكية بالمنصة
  onSubmit(): void {
    const front = this.documentFrontFile();
    const back = this.documentBackFile();
    const selfie = this.selfieFile();

    if (!this.kycForm.valid || !front || !back || !selfie || this.formState() === 'loading') {
      this.errorMessage.set('Please complete the 14-digit Document Number and attach all 3 required profile pictures.');
      this.kycForm.markAllAsTouched();
      return;
    }

    this.formState.set('loading');
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const formData = new FormData();
    formData.append('userId', parseInt(localStorage.getItem('userId') || '0', 10).toString());
    formData.append('documentType', 'NATIONAL_ID');
    formData.append('documentNumber', this.kycForm.get('documentNumber')?.value || '');
    formData.append('status', 'Pending');

    formData.append('documentFront', front, this.documentFrontName() || 'front.jpg');
    formData.append('documentBack', back, this.documentBackName() || 'back.jpg');
    formData.append('selfieImage', selfie, this.selfieFileName() || 'selfie.jpg');

    this.authService.verifyKYC(formData).subscribe({
      next: (response) => {
        this.formState.set('success');
        this.successMessage.set('Your data has been submitted for review successfully. Your documents will be audited within 24 hours.');
        setTimeout(() => this.router.navigate(['/dashboard']), 2200);
      },
      error: (error) => {
        this.formState.set('error');
        this.errorMessage.set(error?.error?.message || 'An error occurred while submitting your data. Please try again later.');
        console.error('KYC Verification Error:', error);
      }
    });
  }
}