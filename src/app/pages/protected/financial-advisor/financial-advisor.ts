import { Component, ElementRef, ViewChild, AfterViewChecked, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChatService, ConversationSession } from '../../../core/services/chat.service';

@Component({
  selector: 'app-financial-advisor',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './financial-advisor.html',
  styleUrl: './financial-advisor.css',
})
export class FinancialAdvisor implements OnInit, AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  currentConversationId: number | null = null;
  conversationsHistory: ConversationSession[] = [];
  
  suggestedQuestions: string[] = [
    'معي ميزانية 50,000 ج.م، كيف أوزعها؟',
    'هل الوقت الحالي مناسب لشراء سبائك الفضة؟',
    'كيف أحمي مدخراتي من التضخم الحالي؟',
    'تحليل فني سريع لأسعار الذهب اليوم.'
  ];

  messages: Array<{ text: string; sender: 'user' | 'ai'; timestamp: Date }> = [];
  newMessage: string = '';
  isLoading: boolean = false;
  currentIntent: string  = 'faq';

  // Injecting our brand new service here
  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.initializeChat();
    this.loadConversationsHistory();
  }

  ngAfterViewChecked() { 
    this.scrollToBottom(); 
  }

  initializeChat() {
    this.messages = [
      { 
        text: 'مرحباً بك في وحدة الاستشارات المالية الذكية! 💼 أنا هنا لمساعدتك في بناء استراتيجيات الشراء، حساب أوزان محفظتك الثمينة، وتحليل أنسب الفرص الاستثمارية بناءً على رأس مالك الحالي. ما هي خطتك أو ميزانيتك اليوم؟', 
        sender: 'ai', 
        timestamp: new Date() 
      }
    ];
    this.currentConversationId = null;
    this.currentIntent = 'faq';
  }

  loadConversationsHistory() {
    this.chatService.getConversationsHistory().subscribe({
      next: (res) => this.conversationsHistory = res,
      error: (err) => console.error('Error fetching history through service', err)
    });
  }

  loadConversationById(id: number) {
    this.isLoading = true;
    this.chatService.getConversationById(id).subscribe({
      next: (res) => {
        this.currentConversationId = res.id;
        this.messages = res.messages.map(msg => ({
          text: msg.content,
          sender: msg.role === 'user' ? 'user' : 'ai',
          timestamp: new Date(msg.createdAt)
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading thread through service', err);
        this.isLoading = false;
      }
    });
  }

  deleteConversation(id: number, event: Event) {
    event.stopPropagation(); 
    this.chatService.deleteConversation(id).subscribe({
      next: () => {
        this.conversationsHistory = this.conversationsHistory.filter(c => c.id !== id);
        if (this.currentConversationId === id) {
          this.initializeChat();
        }
      },
      error: (err) => console.error('Failed to delete history item', err)
    });
  }

  sendMessage(customMessage?: string) {
    const messageToSend = customMessage || this.newMessage;
    if (!messageToSend.trim() || this.isLoading) return;

    this.messages.push({ text: messageToSend, sender: 'user', timestamp: new Date() });
    if (!customMessage) this.newMessage = '';
    
    this.isLoading = true;

    this.chatService.sendMessage(messageToSend, this.currentConversationId).subscribe({
      next: (res) => {
        this.messages.push({
          text: res.reply,
          sender: 'ai',
          timestamp: new Date()
        });
        this.currentConversationId = res.conversationId;
        this.currentIntent = res.intent;
        this.isLoading = false;
        this.loadConversationsHistory();
      },
      error: (err) => {
        console.error('Service stream execution error:', err);
        this.messages.push({
          text: 'عذراً، حدث خطأ أثناء الاتصال بالخادم. يرجى التأكد من الـ Authentication ومحاولة المحاولة مرة أخرى.',
          sender: 'ai',
          timestamp: new Date()
        });
        this.isLoading = false;
      }
    });
  }

  private scrollToBottom(): void {
    try { 
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight; 
    } catch (err) {}
  }
}