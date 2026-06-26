import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // التحقق من وجود توكن تسجيل الدخول في المتصفح
  const token = localStorage.getItem('authToken');

  if (token) {
    // إذا كان المستخدم مسجلاً دخوله بالفعل، يتم توجيهه إلى الصفحة الرئيسية (أو لوحة التحكم)
    router.navigate(['/']);
    return false; // منع الدخول إلى صفحات المصادقة (مثل الـ login والـ register)
  }

  // إذا لم يكن مسجلاً، يُسمح له بفتح الصفحة بشكل طبيعي
  return true;
};