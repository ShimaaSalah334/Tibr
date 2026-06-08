import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export type AppLocale = 'en' | 'ar';
const DEFAULT_LOCALE: AppLocale = 'en';
const STORAGE_KEY = 'tibr_locale';
const TRANSLATION_PATH = '/i18n';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  readonly currentLang = signal<AppLocale>(this.loadLocale());
  readonly translations = signal<Record<string, string>>({});
  readonly loading = signal<boolean>(false);

  constructor(private http: HttpClient) {
    this.applyDocumentLanguage(this.currentLang());
    this.loadTranslations(this.currentLang());
  }

  setLanguage(lang: AppLocale): void {
    if (lang === this.currentLang()) {
      return;
    }

    this.currentLang.set(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    this.applyDocumentLanguage(lang);
    this.loadTranslations(lang);
  }

  translate(key: string, fallback = ''): string {
    return this.translations()[key] ?? fallback ?? key;
  }

  private async loadTranslations(lang: AppLocale): Promise<void> {
    this.loading.set(true);
    try {
      const translations = await firstValueFrom(
        this.http.get<Record<string, string>>(`${TRANSLATION_PATH}/${lang}.json`)
      );
      this.translations.set(translations ?? {});
    } catch {
      this.translations.set({});
    } finally {
      this.loading.set(false);
    }
  }

  private loadLocale(): AppLocale {
    const stored = localStorage.getItem(STORAGE_KEY) as AppLocale | null;
    if (stored === 'ar') {
      return 'ar';
    }
    return DEFAULT_LOCALE;
  }

  private applyDocumentLanguage(lang: AppLocale): void {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  }
}
