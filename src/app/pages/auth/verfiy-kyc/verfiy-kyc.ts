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

  // Expose a plain property for template bindings to avoid calling functions in templates
  get cameraCaptured(): boolean {
    return this.isCameraCaptured();
  }

  ngOnInit(): void {
    this.initForm();
    this.trackFormChanges();
  }

  private initForm(): void {
    this.kycForm = this.fb.group({
      documentType: ['NATIONAL_ID', [Validators.required]],
      documentNumber: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  // تتبع المدخلات لتحديث مؤشر تقدم العملية أولاً بأول للأداء السلس
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
        alert('حجم الملف المرفق يتجاوز الحد المسموح به (5 ميجابايت).');
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
      this.selfieCaptureError.set('متصفحك لا يدعم الكاميرا.');
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
      this.selfieCaptureError.set('تعذّر الوصول إلى الكاميرا. تأكد من إذن المتصفح وحاول مرة أخرى.');
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
      this.selfieCaptureError.set('حدث خطأ داخلي أثناء التقاط الصورة.');
      return;
    }

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const context = canvas.getContext('2d');

    if (!context) {
      this.selfieCaptureError.set('لا يمكن الوصول إلى كاميرا الرسم.');
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
      if (!blob) {
        this.selfieCaptureError.set('فشل إنشاء صورة السيلفي. حاول مرة أخرى.');
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
      this.errorMessage.set('الرجاء تعبئة الحقول المطلوبة ورفع صور الوثيقة (أمام/خلف) وصورة السيلفي.');
      this.kycForm.markAllAsTouched();
      return;
    }

    this.formState.set('loading');
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const formData = new FormData();
    // استخدم معرف المستخدم الفعلي من الجلسة هنا بدلاً من 1
    formData.append('userId', parseInt(localStorage.getItem('userId') || '0', 10).toString());
    formData.append('documentType', this.kycForm.get('documentType')?.value || 'NATIONAL_ID');
    formData.append('documentNumber', this.kycForm.get('documentNumber')?.value || '');
    formData.append('status', 'Pending');

    formData.append('documentFront', front, this.documentFrontName() || 'front.jpg');
    formData.append('documentBack', back, this.documentBackName() || 'back.jpg');
    formData.append('selfieImage', selfie, this.selfieFileName() || 'selfie.jpg');

    this.authService.verifyKYC(formData).subscribe({
      next: (response) => {
        this.formState.set('success');
        this.successMessage.set('تم إرسال بياناتك للمراجعة بنجاح. سيتم التحقق من وثائقك خلال 24 ساعة.');
        setTimeout(() => this.router.navigate(['/dashboard']), 2000);
      },
      error: (error) => {
        this.formState.set('error');
        this.errorMessage.set(error?.error?.message || 'حدث خطأ أثناء إرسال البيانات. يرجى المحاولة مرة أخرى.');
        console.error('KYC Verification Error:', error);
      }
    });
  }
}
