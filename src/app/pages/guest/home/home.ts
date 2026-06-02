import {
  Component, inject, OnInit, AfterViewInit, OnDestroy, signal
} from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductService }  from '../../../core/services/product-service';
import { CategoryService } from '../../../core/services/category-service';
import { IProduct }   from '../../../core/interfaces/iproduct';
import { ICategory }  from '../../../core/interfaces/icategory';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, DecimalPipe],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit, AfterViewInit, OnDestroy {

  private productService  = inject(ProductService);
  private categoryService = inject(CategoryService);
  private router          = inject(Router);

  // ── State ─────────────────────────────────────────────────
  categories       = signal<ICategory[]>([]);
  newestProducts   = signal<IProduct[]>([]);
  popularProducts  = signal<IProduct[]>([]);

  isLoadingCategories = signal<boolean>(false);
  isLoadingNewest     = signal<boolean>(false);
  isLoadingPopular    = signal<boolean>(false);

  errorNewest  = signal<string | null>(null);
  errorPopular = signal<string | null>(null);

  private animationId: number | null = null;

  // ── Lifecycle ─────────────────────────────────────────────
  ngOnInit(): void {
    this.loadCategories();
    this.loadNewestProducts();
    this.loadPopularProducts();
  }

  ngAfterViewInit(): void {
    this.initParticles();
    this.initScrollReveal();
    this.initCounters();
  }

  ngOnDestroy(): void {
    if (this.animationId !== null)
      cancelAnimationFrame(this.animationId);
  }

  // ── Data loaders ──────────────────────────────────────────
  private loadCategories(): void {
    this.isLoadingCategories.set(true);
    this.categoryService.getAllCategories().subscribe({
      next: data => { this.categories.set(data); this.isLoadingCategories.set(false); },
      error: ()  => this.isLoadingCategories.set(false)
    });
  }

  private loadNewestProducts(): void {
    this.isLoadingNewest.set(true);
    this.errorNewest.set(null);
    this.productService.getProducts({ sortBy: 'newest', pageSize: 8, pageNumber: 1 }).subscribe({
      next: data => { this.newestProducts.set(data.items); this.isLoadingNewest.set(false); },
      error: () => { this.errorNewest.set('Failed to load.'); this.isLoadingNewest.set(false); }
    });
  }

  private loadPopularProducts(): void {
    this.isLoadingPopular.set(true);
    this.productService.getProducts({ sortBy: 'popularity', pageSize: 8, pageNumber: 1 }).subscribe({
      next: data => { this.popularProducts.set(data.items); this.isLoadingPopular.set(false); },
      error: () => this.isLoadingPopular.set(false)
    });
  }

  // ── Navigation ────────────────────────────────────────────
  goToProductDetails(id: number): void       { this.router.navigate(['/products', id]); }
  goToProductsByCategory(name: string): void { this.router.navigate(['/products'], { queryParams: { categoryName: name } }); }
  goToProductsByMetal(type: string): void    { this.router.navigate(['/products'], { queryParams: { metalType: type } }); }

  // ── Category icon ─────────────────────────────────────────
  getCategoryIcon(name: string): string {
    const map: Record<string, string> = {
      'Bars':     'fa-solid fa-square',
      'Coins':    'fa-solid fa-circle-dot',
      'Rounds':   'fa-solid fa-record-vinyl',
      'Granules': 'fa-solid fa-droplet',
    };
    return map[name] ?? 'fa-solid fa-gem';
  }

  // ── Magnetic card effect (Angular version of JS mousemove) ─
  onCardMouseMove(event: MouseEvent): void {
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const cx = rect.width  / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -6;
    const rotY = ((x - cx) / cx) *  6;
    card.style.transform = `translateY(-8px) scale(1.02) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  }

  onCardMouseLeave(event: MouseEvent): void {
    const card = event.currentTarget as HTMLElement;
    card.style.transform = '';
    card.style.transition = 'transform 0.6s cubic-bezier(0.2,1,0.3,1)';
    setTimeout(() => card.style.transition = '', 600);
  }

  // ── Particle canvas ───────────────────────────────────────
  private initParticles(): void {
    const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 200 }, () => this.createParticle(canvas));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.life -= 0.08;

        if (p.x > canvas.width || p.x < 0 || p.y > canvas.height || p.y < 0 || p.life < 0)
          Object.assign(p, this.createParticle(canvas));

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle   = p.color;
        ctx.shadowBlur  = 4;
        ctx.shadowColor = '#D4AF37';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur  = 0;
        ctx.globalAlpha = 1;
      });
      this.animationId = requestAnimationFrame(animate);
    };
    animate();
  }

  private createParticle(canvas: HTMLCanvasElement) {
    return {
      x:      Math.random() * canvas.width,
      y:      Math.random() * canvas.height,
      size:   Math.random() * 2 + 0.3,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      alpha:  Math.random() * 0.4 + 0.1,
      life:   Math.random() * 100 + 50,
      color:  Math.random() > 0.4 ? '#D4AF37' : '#C0C0C0'
    };
  }

  // ── Scroll reveal ─────────────────────────────────────────
  private initScrollReveal(): void {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // ── Counters ──────────────────────────────────────────────
  private initCounters(): void {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const el     = e.target as HTMLElement;
            const target = parseInt(el.dataset['target'] || '0');
            this.animateCounter(el, target);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll('.counter').forEach(el => observer.observe(el));
  }

  private animateCounter(el: HTMLElement, target: number): void {
    let current = 0;
    const step  = target / (1800 / 16);
    const run   = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target.toLocaleString();
        clearInterval(run);
      } else {
        el.textContent = Math.floor(current).toLocaleString();
      }
    }, 16);
  }
}