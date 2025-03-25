export interface WorkingHours {
  start: string;
  end: string;
  breaks?: {
    start: string;
    end: string;
  }[];
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export interface Timezone {
  code: string;
  name: string;
  offset: string | number;
}

export interface GeneralSettings {
  businessName: string;
  logo: string;
  timezone: string;
  currency: string;
  language: string;
  workingDays: Record<string, boolean>;
  workingHours: WorkingHours;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
  };
  theme: 'light' | 'dark' | 'system';
} 