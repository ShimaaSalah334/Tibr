import { Component, ElementRef, ViewChild, AfterViewChecked, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiAcademyService } from '../../../core/services/ai-academy.service';
import { MarkdownPipe } from '../../../shared/pipes/markdown.pipe';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { I18nService } from '../../../core/services/i18n.service';

interface Message {
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

@Component({
  selector: 'app-ai-academy-component',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownPipe, TranslatePipe],
  templateUrl: './ai-academy-component.html',
  styleUrl: './ai-academy-component.css',
})
export class AiAcademyComponent implements AfterViewChecked, OnInit {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  private aiService = inject(AiAcademyService);
  readonly i18n = inject(I18nService);

  private sessionId: string = crypto.randomUUID();

  suggestedQuestionKeys: string[] = [
    'aiAcademy.question1',
    'aiAcademy.question2',
    'aiAcademy.question3',
    'aiAcademy.question4',
  ];

  messages: Message[] = [];

  ngOnInit(): void {
    this.initializeChat();
  }
  
  newMessage: string = '';
  isLoading: boolean = false;

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  initializeChat() {
    this.messages = [
      {
        text: this.i18n.translate('aiAcademy.welcome'),
        sender: 'ai',
        timestamp: new Date()
      }
    ];
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

  this.aiService.askQuestion(messageToSend, this.sessionId).subscribe({
    next: (response) => {
      console.log('Response from server:', response);
      
      const aiResponseText = response?.choices?.[0]?.message?.content
                             || this.i18n.translate('aiAcademy.error');

      this.messages.push({
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date()
      });
    },
    error: (err) => {
      console.error('حدث خطأ أثناء الاتصال بالـ API:', err);
      this.messages.push({
        text: this.i18n.translate('aiAcademy.error'),
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