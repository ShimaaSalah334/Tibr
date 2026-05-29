import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.Service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,RouterModule,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  
  // Using Angular Signals for state management
  hidePassword = signal<boolean>(true);
  isEmailFocused = signal<boolean>(false);
  isPasswordFocused = signal<boolean>(false);
  formState = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  errorMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      remember: [false]
    });
  }

  togglePasswordView(): void {
    this.hidePassword.update(prev => !prev);
  }

  onSubmit(): void {
    if (!this.loginForm.valid || this.formState() !== 'idle') {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.formState.set('loading');
    this.errorMessage.set(null);

    const credentials = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
      remember: this.loginForm.get('remember')?.value
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.formState.set('success');

        const token = response?.token || response?.accessToken || response?.authToken;
        const userId = response?.userId || response?.id || response?.user?.id;

        if (token) {
          localStorage.setItem('authToken', token);
        }

        if (userId) {
          localStorage.setItem('userId', String(userId));
        }

        
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.formState.set('error');
        this.errorMessage.set(error?.error?.message || 'حدث خطأ أثناء تسجيل الدخول. تأكد من بياناتك وحاول مرة أخرى.');
        console.error('Login failed:', error);
      }
    });
  }
}
