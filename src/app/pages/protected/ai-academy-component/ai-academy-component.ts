import { Component, ElementRef, ViewChild, AfterViewChecked, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiAcademyService } from '../../../core/services/ai-academy.service';

interface Message {
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

@Component({
  selector: 'app-ai-academy-component',
  standalone: true, // مضافة للتأكيد إذا كان المكون Standalone
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-academy-component.html',
  styleUrl: './ai-academy-component.css',
})
export class AiAcademyComponent implements AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  // حقن الخدمة باستخدام inject (أو عبر الـ constructor)
  private aiService = inject(AiAcademyService);

  // توليد معرف جلسة فريد للمستخدم الحالي عند فتح الصفحة
  private sessionId: string = crypto.randomUUID();

  suggestedQuestions: string[] = [
    'ما الفرق بين الاستثمار في الذهب والفضة؟',
    'كيف أحسب مصنعية السبائك؟',
    'ما هي أفضل الأوقات لشراء المعادن الثمينة؟',
    'شرح مبسط لمفهوم التضخم وعلاقته بالذهب.'
  ];

  messages: Message[] = [
    { 
      text: 'مرحباً بك في أكاديمية تبر التعليمية! 🎓 أنا مستشارك الأكاديمي لمساعدتك في فهم أسس وآليات الاستثمار في الذهب والفضة من الصفر. يمكنك اختصار الوقت واختيار أحد الأسئلة الجاهزة بالأسفل أو كتابة استفسارك مباشرة!', 
      sender: 'ai', 
      timestamp: new Date() 
    }
  ];
  
  newMessage: string = '';
  isLoading: boolean = false;

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

sendMessage(customMessage?: string) {
  const messageToSend = customMessage || this.newMessage;
  
  if (!messageToSend.trim() || this.isLoading) return;

  // 1. إضافة رسالة المستخدم للواجهة
  this.messages.push({
    text: messageToSend,
    sender: 'user',
    timestamp: new Date()
  });

  if (!customMessage) {
    this.newMessage = ''; 
  }
  
  this.isLoading = true;

  // 2. استدعاء الـ API الفعلي عبر الخدمة
  this.aiService.askQuestion(messageToSend, this.sessionId).subscribe({
    next: (response) => {
      // طباعة الرد للتأكد منه في الـ Console
      console.log('Response from server:', response);
      
      // استخراج النص بناءً على هيكلة الـ JSON الجديدة
      const aiResponseText = response?.choices?.[0]?.message?.content 
                             || 'تم استقبال استجابة فارغة أو غير معروفة.';

      this.messages.push({
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date()
      });
    },
    error: (err) => {
      console.error('حدث خطأ أثناء الاتصال بالـ API:', err);
      this.messages.push({
        text: 'عذراً، واجهت مشكلة في الاتصال بالخادم الحالي. يرجى المحاولة مرة أخرى لاحقاً.',
        sender: 'ai',
        timestamp: new Date()
      });
      this.isLoading = false;
    },
    complete: () => {
      this.isLoading = false;
    }
  });
}

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
}