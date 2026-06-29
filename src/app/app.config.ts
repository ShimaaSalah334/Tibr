import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
 provideToastr({
  timeOut: 4000,
  positionClass: 'toast-top-right', // اختر الموضع الذي يناسبك هنا
  preventDuplicates: true,
  progressBar: true,      // إظهار شريط تقدم زمني ممتع في الأسفل
  progressAnimation: 'decreasing', // طريقة حركة الشريط (يقل تدريجياً)
  closeButton: true,      // إظهار زر (X) لإغلاق التنبيه يدوياً
  newestOnTop: true,      // التنبيهات الجديدة تظهر فوق التنبيهات القديمة
  tapToDismiss: true,     // إغلاق التنبيه بمجرد الضغط عليه في أي مكان
})
  ]
};
