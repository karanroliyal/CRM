import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../../shared/components/card/card.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { SettingsService } from '../../services/settings.service';
import { Observable, Subscription } from 'rxjs';
import { GeneralSettings, WorkingHours, Currency, Language, Timezone } from '../../interfaces/settings.interface';

interface SettingsSection {
  id: string;
  name: string;
  icon: string;
  badge?: string;
  badgeClass?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  avatar?: string;
  lastLogin?: Date;
  createdAt: Date;
}

interface Role {
  id: number;
  name: string;
  permissions: string[];
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Integration {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  lastSync?: Date;
  status: 'active' | 'pending' | 'error';
  config?: Record<string, any>;
}

interface AISettings {
  enableAI: boolean;
  smartFollowUps: boolean;
  leadScoring: boolean;
  autoResponders: boolean;
  sentimentAnalysis: boolean;
  followUpSuggestions: boolean;
  confidenceThreshold: number;
  maxSuggestionsPerDay: number;
  preferredLanguages: string[];
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CardComponent,
    LoaderComponent
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {
  private logoSubscription?: Subscription;
  private readonly fb: FormBuilder;
  
  settingsService: SettingsService;
  logoUrl$: Observable<string>;
  
  settingsSections: SettingsSection[] = [
    { id: 'general', name: 'General Settings', icon: 'gear' },
    { id: 'users', name: 'User & Role Management', icon: 'people' },
    { id: 'follow-up', name: 'Follow-Up Settings', icon: 'bell' },
    { id: 'communication', name: 'Communication Settings', icon: 'chat-dots' },
    { id: 'task', name: 'Task & Reminder Settings', icon: 'list-check' },
    { id: 'integration', name: 'API & Integration Settings', icon: 'box-arrow-in-down' },
    { id: 'payment', name: 'Payment & Invoice Settings', icon: 'credit-card' },
    { id: 'notification', name: 'Notification & Alert Settings', icon: 'bell-fill' },
    { id: 'security', name: 'Security & Privacy Settings', icon: 'shield-lock' },
    { id: 'subscription', name: 'Subscription & Billing', icon: 'cash-coin' },
    { id: 'ai', name: 'AI & Automation Settings', icon: 'robot', badge: 'New', badgeClass: 'bg-success' }
  ];

  activeSettingSection: string = 'general';
  
  // Forms
  generalSettingsForm!: FormGroup;
  userForm?: FormGroup;
  roleForm?: FormGroup;
  followUpForm?: FormGroup;
  communicationForm?: FormGroup;
  
  // Options
  days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  timeSlots: string[] = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
    return `${formattedHour}:${minute}`;
  });
  
  currencies: Currency[] = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' }
  ];
  
  languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' }
  ];
  
  timezones: Timezone[] = [
    { code: 'UTC-12:00', name: '(UTC-12:00) International Date Line West', offset: -12 },
    { code: 'UTC-11:00', name: '(UTC-11:00) Coordinated Universal Time-11', offset: -11 },
    { code: 'UTC-10:00', name: '(UTC-10:00) Hawaii', offset: -10 },
    { code: 'UTC-09:00', name: '(UTC-09:00) Alaska', offset: -9 },
    { code: 'UTC-08:00', name: '(UTC-08:00) Pacific Time (US & Canada)', offset: -8 },
    { code: 'UTC-07:00', name: '(UTC-07:00) Mountain Time (US & Canada)', offset: -7 },
    { code: 'UTC-06:00', name: '(UTC-06:00) Central Time (US & Canada)', offset: -6 },
    { code: 'UTC-05:00', name: '(UTC-05:00) Eastern Time (US & Canada)', offset: -5 },
    { code: 'UTC-04:00', name: '(UTC-04:00) Atlantic Time (Canada)', offset: -4 },
    { code: 'UTC-03:00', name: '(UTC-03:00) Brasilia', offset: -3 },
    { code: 'UTC-02:00', name: '(UTC-02:00) Coordinated Universal Time-02', offset: -2 },
    { code: 'UTC-01:00', name: '(UTC-01:00) Azores', offset: -1 },
    { code: 'UTC+00:00', name: '(UTC+00:00) London, Dublin, Edinburgh', offset: 0 },
    { code: 'UTC+01:00', name: '(UTC+01:00) Berlin, Paris, Rome, Madrid', offset: 1 },
    { code: 'UTC+02:00', name: '(UTC+02:00) Athens, Istanbul, Cairo', offset: 2 },
    { code: 'UTC+03:00', name: '(UTC+03:00) Moscow, Kuwait, Riyadh', offset: 3 },
    { code: 'UTC+04:00', name: '(UTC+04:00) Dubai, Baku', offset: 4 },
    { code: 'UTC+05:00', name: '(UTC+05:00) Karachi, Tashkent', offset: 5 },
    { code: 'UTC+05:30', name: '(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi', offset: 5.5 },
    { code: 'UTC+06:00', name: '(UTC+06:00) Dhaka, Almaty', offset: 6 },
    { code: 'UTC+07:00', name: '(UTC+07:00) Bangkok, Hanoi, Jakarta', offset: 7 },
    { code: 'UTC+08:00', name: '(UTC+08:00) Beijing, Hong Kong, Singapore', offset: 8 },
    { code: 'UTC+09:00', name: '(UTC+09:00) Tokyo, Seoul', offset: 9 },
    { code: 'UTC+10:00', name: '(UTC+10:00) Sydney, Melbourne', offset: 10 },
    { code: 'UTC+11:00', name: '(UTC+11:00) Vladivostok', offset: 11 },
    { code: 'UTC+12:00', name: '(UTC+12:00) Auckland, Wellington', offset: 12 }
  ];
  
  users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      status: 'Active',
      avatar: 'assets/avatars/john.jpg',
      lastLogin: new Date('2024-03-20T10:30:00'),
      createdAt: new Date('2023-01-15')
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      role: 'Sales', 
      status: 'Active',
      createdAt: new Date('2023-02-15')
    },
    { 
      id: 3, 
      name: 'Michael Brown', 
      email: 'michael@example.com', 
      role: 'Finance', 
      status: 'Inactive',
      createdAt: new Date('2023-03-15')
    },
    { 
      id: 4, 
      name: 'Sara Wilson', 
      email: 'sara@example.com', 
      role: 'HR', 
      status: 'Active',
      createdAt: new Date('2023-04-15')
    }
  ];
  
  roles: Role[] = [
    {
      id: 1,
      name: 'Admin',
      permissions: ['all'],
      description: 'Full access to all features',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2024-03-01')
    },
    { id: 2, name: 'Sales', permissions: ['sales'], description: 'Access to sales and follow-ups', createdAt: new Date('2023-01-01'), updatedAt: new Date('2024-03-01') },
    { id: 3, name: 'Finance', permissions: ['invoices', 'payments'], description: 'Access to invoices and payments', createdAt: new Date('2023-01-01'), updatedAt: new Date('2024-03-01') },
    { id: 4, name: 'HR', permissions: ['users'], description: 'Access to user management', createdAt: new Date('2023-01-01'), updatedAt: new Date('2024-03-01') }
  ];
  
  integrations: Integration[] = [
    {
      id: 'gmail',
      name: 'Gmail',
      icon: 'envelope',
      connected: true,
      lastSync: new Date('2024-03-20T15:00:00'),
      status: 'active',
      config: {
        emailAddress: 'business@example.com',
        syncFrequency: 'realtime'
      }
    },
    { id: 'outlook', name: 'Outlook', icon: 'envelope', connected: false, status: 'pending' },
    { id: 'whatsapp', name: 'WhatsApp Business', icon: 'chat-fill', connected: false, status: 'pending' },
    { id: 'slack', name: 'Slack', icon: 'chat-left', connected: true, status: 'active' },
    { id: 'teams', name: 'Microsoft Teams', icon: 'people', connected: false, status: 'pending' },
    { id: 'salesforce', name: 'Salesforce', icon: 'cloud', connected: false, status: 'pending' },
    { id: 'zapier', name: 'Zapier', icon: 'lightning', connected: true, status: 'active' },
    { id: 'hubspot', name: 'HubSpot', icon: 'diagram-3', connected: false, status: 'pending' },
    { id: 'twilio', name: 'Twilio SMS', icon: 'chat-text', connected: true, status: 'active' },
    { id: 'google-calendar', name: 'Google Calendar', icon: 'calendar-date', connected: true, status: 'active' }
  ];

  aiSettings: AISettings = {
    enableAI: true,
    smartFollowUps: true,
    leadScoring: true,
    autoResponders: false,
    sentimentAnalysis: true,
    followUpSuggestions: true,
    confidenceThreshold: 0.85,
    maxSuggestionsPerDay: 10,
    preferredLanguages: ['en', 'es']
  };
  
  // States
  isLoading = false;
  saveSuccess = false;
  saveError = false;
  
  constructor(settingsService: SettingsService) {
    this.fb = new FormBuilder();
    this.settingsService = settingsService;
    this.logoUrl$ = this.settingsService.getLogo();
    this.initializeForms();
  }

  private initializeForms(): void {
    this.generalSettingsForm = this.fb.group({
      businessName: ['', [Validators.required, Validators.minLength(2)]],
      logo: [''],
      timezone: ['', Validators.required],
      currency: ['', Validators.required],
      language: ['', Validators.required],
      dateFormat: ['YYYY-MM-DD', Validators.required],
      timeFormat: ['24h', Validators.required],
      workingDays: this.fb.group(
        this.days.reduce((acc, day) => ({
          ...acc,
          [day]: [day === 'Saturday' || day === 'Sunday' ? false : true]
        }), {})
      ),
      workingHours: this.fb.group({
        start: ['09:00', Validators.required],
        end: ['17:00', Validators.required],
        breaks: this.fb.array([])
      }),
      notifications: this.fb.group({
        email: [true],
        push: [true],
        desktop: [true]
      }),
      theme: ['light' as 'light' | 'dark' | 'system', Validators.required]
    });
  }

  ngOnInit(): void {
    this.logoSubscription = this.logoUrl$.subscribe((url: string) => {
      this.generalSettingsForm.patchValue({ logo: url });
    });
    this.loadSettings();
  }

  ngOnDestroy(): void {
    if (this.logoSubscription) {
      this.logoSubscription.unsubscribe();
    }
  }

  private async loadSettings(): Promise<void> {
    try {
      this.isLoading = true;
      // Load settings from service
      // Patch forms with loaded settings
    } catch (error) {
      console.error('Error loading settings:', error);
      this.saveError = true;
    } finally {
      this.isLoading = false;
    }
  }

  setActiveSection(sectionId: string): void {
    this.activeSettingSection = sectionId;
  }
  
  async uploadLogo(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) return;
    
    try {
      this.isLoading = true;
      const logoUrl = await this.settingsService.uploadLogo(file);
      this.generalSettingsForm.patchValue({ logo: logoUrl });
      this.saveSuccess = true;
      setTimeout(() => this.saveSuccess = false, 3000);
    } catch (error) {
      console.error('Error uploading logo:', error);
      this.saveError = true;
      setTimeout(() => this.saveError = false, 3000);
    } finally {
      this.isLoading = false;
    }
  }
  
  async saveSettings(): Promise<void> {
    if (this.generalSettingsForm.valid) {
      try {
        const formValue = this.generalSettingsForm.value;
        const settings: GeneralSettings = {
          ...formValue,
          notifications: {
            email: formValue.notifications?.email ?? true,
            push: formValue.notifications?.push ?? true,
            desktop: formValue.notifications?.desktop ?? true
          },
          theme: formValue.theme as 'light' | 'dark' | 'system'
        };
        await this.settingsService.saveGeneralSettings(settings);
        this.saveSuccess = true;
        setTimeout(() => this.saveSuccess = false, 3000);
      } catch (error) {
        console.error('Failed to save settings:', error);
        this.saveError = true;
        setTimeout(() => this.saveError = false, 3000);
      }
    }
  }
  
  async toggleIntegration(id: string): Promise<void> {
    try {
      this.isLoading = true;
      const integration = this.integrations.find(i => i.id === id);
      if (!integration) return;
      
      if (integration.connected) {
        await this.settingsService.disconnectIntegration(id);
      } else {
        await this.settingsService.connectIntegration(id);
      }
      
      integration.connected = !integration.connected;
      integration.status = integration.connected ? 'active' : 'pending';
      integration.lastSync = integration.connected ? new Date() : undefined;
    } catch (error) {
      console.error('Error toggling integration:', error);
      this.saveError = true;
      setTimeout(() => this.saveError = false, 3000);
    } finally {
      this.isLoading = false;
    }
  }

  // Add methods for managing users and roles
  async addUser(user: Partial<User>): Promise<void> {
    // Implementation
  }

  async updateUser(id: number, updates: Partial<User>): Promise<void> {
    // Implementation
  }

  async deleteUser(id: number): Promise<void> {
    // Implementation
  }

  async addRole(role: Partial<Role>): Promise<void> {
    // Implementation
  }

  async updateRole(id: number, updates: Partial<Role>): Promise<void> {
    // Implementation
  }

  async deleteRole(id: number): Promise<void> {
    // Implementation
  }

  // Add methods for managing AI settings
  async updateAISettings(settings: Partial<AISettings>): Promise<void> {
    // Implementation
  }

  private formatTimezoneOffset(offset: number): string {
    const sign = offset >= 0 ? '+' : '-';
    const absOffset = Math.abs(offset);
    const hours = Math.floor(absOffset);
    const minutes = (absOffset % 1) * 60;
    
    return `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  // Helper method to get timezone display name
  getTimezoneDisplay(timezone: Timezone): string {
    return `${timezone.name} (${this.formatTimezoneOffset(Number(timezone.offset))})`;
  }
} 