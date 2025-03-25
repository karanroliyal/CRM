import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private logoUrlSubject = new BehaviorSubject<string>('assets/images/default-logo.png');
  public logoUrl$ = this.logoUrlSubject.asObservable();

  private readonly LOGO_STORAGE_KEY = 'crm_logo_url';

  constructor() {
    // Load saved logo URL from localStorage on service initialization
    const savedLogo = localStorage.getItem(this.LOGO_STORAGE_KEY);
    if (savedLogo) {
      this.logoUrlSubject.next(savedLogo);
    }
  }

  updateLogo(logoUrl: string) {
    this.logoUrlSubject.next(logoUrl);
    localStorage.setItem(this.LOGO_STORAGE_KEY, logoUrl);
  }

  getLogo(): Observable<string> {
    return this.logoUrl$;
  }

  // Method to handle logo file upload
  async uploadLogo(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const logoUrl = e.target?.result as string;
        this.updateLogo(logoUrl);
        resolve(logoUrl);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }
} 