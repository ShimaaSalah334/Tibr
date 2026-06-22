import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserProfileDto } from '../../../core/interfaces/profile';
import { ProfileService } from '../../../core/services/profile.service';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-profile',
standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {
  activeTab: 'info' | 'security' = 'info';
  profileData!: UserProfileDto;
  
  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  isLoading = true;
  isSubmittingProfile = false;
  isSubmittingPassword = false;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private profileService: ProfileService,
    public i18n: I18nService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.initPasswordForm();
  }

  loadUserData(): void {
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.profileData = data;
        this.initProfileForm(data);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'عذراً، فشل تحميل بيانات الملف الشخصي الخاص بك.';
        this.isLoading = false;
      }
    });
  }

  initProfileForm(user: UserProfileDto): void {
    this.profileForm = this.fb.group({
      firstName: [user.firstName, [Validators.required, Validators.maxLength(50)]],
      lastName: [user.lastName, [Validators.required, Validators.maxLength(50)]],
      phone: [user.phone, [Validators.required, Validators.pattern('^[0-9+\\s-]{8,20}$')]]
    });
  }
  initPasswordForm(): void {
    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmNewPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmNewPassword')?.value
      ? null : { mismatch: true };
  }

  onUpdateProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.isSubmittingProfile = true;
    this.clearAlerts();

    this.profileService.updateProfile(this.profileForm.value).subscribe({
      next: () => {
        this.successMessage = this.i18n.translate('profile.updateSuccess', 'تم تحديث البيانات الاستثمارية بنجاح.');
        this.isSubmittingProfile = false;
        this.profileData.firstName = this.profileForm.value.firstName;
        this.profileData.lastName = this.profileForm.value.lastName;
        this.profileData.phone = this.profileForm.value.phone;
      },
      error: (err) => {
        this.errorMessage = err.error?.ErrorMessage || this.i18n.translate('profile.updateError', 'فشلت عملية تحديث البيانات المحددة.');
        this.isSubmittingProfile = false;
      }
    });
  }

  onChangePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.isSubmittingPassword = true;
    this.clearAlerts();

    this.profileService.changePassword(this.passwordForm.value).subscribe({
      next: () => {
        this.successMessage = this.i18n.translate('profile.passwordUpdateSuccess', 'تمت ترقية وتعديل كلمة المرور بنجاح لحماية حسابك.');
        this.passwordForm.reset();
        this.isSubmittingPassword = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.ErrorMessage || this.i18n.translate('profile.wrongPassword', 'كلمة المرور الحالية غير صحيحة.');
        this.isSubmittingPassword = false;
      }
    });
  }
  switchTab(tab: 'info' | 'security'): void {
    this.activeTab = tab;
    this.clearAlerts();
  }

  clearAlerts(): void {
    this.successMessage = null;
    this.errorMessage = null;
  }
}