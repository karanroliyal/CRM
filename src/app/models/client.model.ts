import { User } from './user.model';

export interface Client {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  companyName?: string;
  status: 'new' | 'in_progress' | 'closed' | 'lost';
  addedBy: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface FollowUpDB {
  id: number;
  clientId: number;
  assignedTo: number;
  title: string;
  followUpDate: Date;
  followUpChannel: 'email' | 'whatsapp' | 'sms' | 'call';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FollowUpHistory {
  id: number;
  followUpId: number;
  actionBy: User;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  actionNotes?: string;
  actionDate: Date;
}

export interface Reminder {
  id: number;
  followUpId: number;
  reminderDate: Date;
  reminderStatus: 'pending' | 'sent';
}

export interface EmailTemplate {
  id: number;
  templateName: string;
  subject: string;
  body: string;
  createdAt: Date;
}

export interface InvoiceFollowUp {
  id: number;
  clientId: number;
  invoiceNumber: string;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue';
  lastFollowUpDate?: Date;
} 