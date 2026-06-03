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

  // إدارة وحفظ ملفات الوثائق والصورة الشخصية
  documentFrontFile = signal<File | null>(null);
  documentFrontName = signal<string | null>(null);
  documentBackFile = signal<File | null>(null);
  documentBackName = signal<string | null>(null);
  selfieFile = signal<File | null>(null);
  selfieFileName = signal<string | null>(null);
  // حالة تشغيل الكاميرا واحتفاظ بصورة السيلفي الملتقطة
  cameraActive = signal<boolean>(false);
  isCameraCaptured = signal<boolean>(false);
  capturedSelfieUrl = signal<string | null>(null);
  selfieCaptureError = signal<string | null>(null);
  mediaStream: MediaStream | null = null;

  @ViewChild('videoPreview') videoPreview!: ElementRef<HTMLVideoElement>;
  @ViewChild('selfieCanvas') selfieCanvas!: ElementRef<HTMLCanvasElement>;

  // إدارة حالة إرسال استمارة البيانات الاستثمارية (idle | loading | success | error)
  formState = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  // رسالة الخطأ
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // إشارات لمراقبة تحديث البيانات وحساب معدل تقدم الملف الشخصي ديناميكياً
  fullNameFilled = signal<boolean>(false);
  birthDateFilled = signal<boolean>(false);
  addressFilled = signal<boolean>(false);

  // حساب النسبة المئوية للمستثمر تلقائياً عبر ميزة الـ computed
  totalProgress = computed(() => {
    let base = 25; // نسبة التقدم الافتراضية السابقة في المنصة
    if (this.fullNameFilled()) base += 15;
    if (this.birthDateFilled()) base += 10;
    if (this.addressFilled()) base += 15;
    if (this.documentFrontName()) base += 8;
    if (this.documentBackName()) base += 8;
    if (this.selfieFileName()) base += 14;
    return Math.min(base, 100);
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  get cameraCaptured(): boolean {
    return this.isCameraCaptured();
  }

  ngOnInit(): void {
    this.initForm();
    this.trackFormChanges();
  }

  private initForm(): void {
    this.kycForm = this.fb.group({
      documentType: ['NATIONAL ID', [Validators.required]],
      documentNumber: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  private trackFormChanges(): void {
    this.kycForm.get('fullName')?.valueChanges.subscribe(value => {
      this.fullNameFilled.set(!!value && value.trim().length >= 6);
    });

    this.kycForm.get('birthDate')?.valueChanges.subscribe(value => {
      this.birthDateFilled.set(!!value);
    });

    this.kycForm.get('address')?.valueChanges.subscribe(value => {
      this.addressFilled.set(!!value && value.trim().length >= 15);
    });
  }

  // تداول ومعالجة ملفات الهوية الأمامية/الخلفية والسيلفي
  onFileSelected(event: Event, field: 'front' | 'back' | 'selfie'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // التأكد من حجم الملف (أقل من 5 ميجابايت)
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
        alert('The size of the attached file exceeds the allowed limit (5 MB). Please choose a smaller file.');
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

  // محاكاة استدعاء كاميرا الجوال / المتصفح لالتقاط الـ Selfie (اختياري)
  async triggerSelfieCapture(): Promise<void> {
    if (!this.cameraActive()) {
      await this.startCamera();
      return;
    }

    this.captureSelfie();
  }

  private async startCamera(): Promise<void> {
    if (!navigator.mediaDevices?.getUserMedia) {
      this.selfieCaptureError.set('Your browser does not support the camera.');
      return;
    }

    try {
      this.selfieCaptureError.set(null);
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      this.cameraActive.set(true);
      this.isCameraCaptured.set(false);
      this.capturedSelfieUrl.set(null);
      if (this.videoPreview?.nativeElement) {
        this.videoPreview.nativeElement.srcObject = this.mediaStream;
        this.videoPreview.nativeElement.play();
      }
    } catch (error) {
      console.error('Camera access error:', error);
      this.selfieCaptureError.set('Camera could not be accessed. Check your browser permissions and try again.');
    }
  }

  private stopCamera(): void {
    if (!this.mediaStream) {
      return;
    }

    this.mediaStream.getTracks().forEach(track => track.stop());
    this.mediaStream = null;
    this.cameraActive.set(false);
  }

  private captureSelfie(): void {
    const video = this.videoPreview?.nativeElement;
    const canvas = this.selfieCanvas?.nativeElement;

    if (!video || !canvas) {
      this.selfieCaptureError.set('An internal error occurred while taking the picture.');
      return;
    }

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const context = canvas.getContext('2d');

    if (!context) {
      this.selfieCaptureError.set('The drawing camera is inaccessible.');
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
      if (!blob) {
        this.selfieCaptureError.set('Selfie creation failed. Please try again.');
        return;
      }

      const file = new File([blob], `selfie-${Date.now()}.jpg`, { type: 'image/jpeg' });
      this.selfieFile.set(file);
      this.selfieFileName.set(file.name);
      this.capturedSelfieUrl.set(URL.createObjectURL(blob));
      this.isCameraCaptured.set(true);
      this.stopCamera();
    }, 'image/jpeg', 0.92);
  }

  // إرسال ومزامنة ملف الـ KYC للمراجعة البنكية بالمنصة
  onSubmit(): void {
    const front = this.documentFrontFile();
    const back = this.documentBackFile();
    const selfie = this.selfieFile();

    if (!this.kycForm.valid || !front || !back || !selfie || this.formState() !== 'idle') {
      this.errorMessage.set('Please complete all required fields and attach all necessary documents before submitting.');
      this.kycForm.markAllAsTouched();
      return;
    }

    this.formState.set('loading');
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const formData = new FormData();
    // استخدم معرف المستخدم الفعلي من الجلسة هنا بدلاً من 1
    formData.append('userId', parseInt(localStorage.getItem('userId') || '0', 10).toString());
    formData.append('documentType','NATIONAL_ID');
    formData.append('documentNumber', this.kycForm.get('documentNumber')?.value || '');
    formData.append('status', 'Pending');

    formData.append('documentFront', front, this.documentFrontName() || 'front.jpg');
    formData.append('documentBack', back, this.documentBackName() || 'back.jpg');
    formData.append('selfieImage', selfie, this.selfieFileName() || 'selfie.jpg');

    this.authService.verifyKYC(formData).subscribe({
      next: (response) => {
        this.formState.set('success');
        this.successMessage.set('Your data has been submitted for review successfully. Your documents will be verified within 24 hours.');
        setTimeout(() => this.router.navigate(['/dashboard']), 2000);
      },
      error: (error) => {
        this.formState.set('error');
        this.errorMessage.set(error?.error?.message || 'An error occurred while submitting your data. Please try again later.');
        console.error('KYC Verification Error:', error);
      }
    });
  }
}
