import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GeneralSettings } from '../interfaces/settings.interface';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly LOGO_STORAGE_KEY = 'app_logo';
  private readonly SETTINGS_STORAGE_KEY = 'general_settings';
  private readonly logoSubject = new BehaviorSubject<string>('assets/images/default-logo.png');
  private readonly defaultSettings: GeneralSettings = {
    businessName: '',
    logo: 'assets/images/default-logo.png',
    timezone: 'UTC+00:00',
    currency: 'USD',
    language: 'en',
    workingDays: {
      Monday: true,
      Tuesday: true,
      Wednesday: true,
      Thursday: true,
      Friday: true,
      Saturday: false,
      Sunday: false
    },
    workingHours: {
      start: '09:00',
      end: '17:00',
      breaks: []
    },
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
    notifications: {
      email: true,
      push: true,
      desktop: true
    },
    theme: 'light' as const
  };

  constructor() {
    const savedLogo = localStorage.getItem(this.LOGO_STORAGE_KEY);
    if (savedLogo) {
      this.logoSubject.next(savedLogo);
    }
  }

  getLogo(): Observable<string> {
    return this.logoSubject.asObservable();
  }

  async uploadLogo(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const logoUrl = reader.result as string;
        localStorage.setItem(this.LOGO_STORAGE_KEY, logoUrl);
        this.logoSubject.next(logoUrl);
        resolve(logoUrl);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  async saveGeneralSettings(settings: GeneralSettings): Promise<void> {
    try {
      // Validate theme type
      if (!['light', 'dark', 'system'].includes(settings.theme)) {
        throw new Error('Invalid theme value');
      }
      localStorage.setItem(this.SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }

  async getGeneralSettings(): Promise<GeneralSettings> {
    const savedSettings = localStorage.getItem(this.SETTINGS_STORAGE_KEY);
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      return {
        ...this.defaultSettings,
        ...settings,
        theme: settings.theme as 'light' | 'dark' | 'system'
      };
    }
    return this.defaultSettings;
  }

  clearLogo(): void {
    localStorage.removeItem(this.LOGO_STORAGE_KEY);
    this.logoSubject.next('assets/images/default-logo.png');
  }

  async connectIntegration(id: string): Promise<void> {
    // Implementation for connecting integration
    console.log(`Connecting integration: ${id}`);
  }

  async disconnectIntegration(id: string): Promise<void> {
    // Implementation for disconnecting integration
    console.log(`Disconnecting integration: ${id}`);
  }
} 