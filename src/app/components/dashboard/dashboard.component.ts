import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { Observable, Subscription, interval } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { CardComponent } from '../../shared/components/card/card.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { StatsCardComponent } from '../../shared/components/stats-card/stats-card.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';
import { SettingsService } from '../../services/settings.service';

type ColorType = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
type BadgeType = ColorType;

interface StatsCard {
  title: string;
  value: string | number;
  icon: string;
  color: ColorType;
  change: number | null;
  subtitle: string;
}

interface FollowUp {
  id: string;
  clientName: string;
  type: string;
  status: string;
  date: Date;
  nextDate: Date;
  priority: string;
  assignedName: string;
  assignedAvatar: string;
  channel: 'Email' | 'WhatsApp' | 'SMS' | 'Call';
  description: string;
}

interface TimelineDay {
  date: Date;
  followUps: FollowUp[];
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  avatar: string;
  progress: number;
  status: ColorType;
}

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  link: string;
}

interface AIInsight {
  icon: string;
  title: string;
  description: string;
  type: 'success' | 'warning' | 'info' | 'danger';
  time: Date;
}

interface Communication {
  type: 'email' | 'whatsapp' | 'sms';
  icon: string;
  title: string;
  description: string;
  time: Date;
}

interface Client {
  name: string;
  lastInteraction: Date;
  score: number;
  scoreClass: 'score-high' | 'score-medium' | 'score-low';
}

interface UsageStats {
  followUps: {
    used: number;
    total: number;
    percentage: number;
  };
  storage: {
    used: string;
    total: string;
    percentage: number;
  };
}

interface Notification {
  icon: string;
  title: string;
  message: string;
  time: Date;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardComponent,
    LoaderComponent,
    StatsCardComponent,
    StatusBadgeComponent,
    TimeAgoPipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('followUpChart') followUpChartRef!: ElementRef;
  @ViewChild('successRateChart') successRateChartRef!: ElementRef;
  @ViewChild('responseTimeChart') responseTimeChartRef!: ElementRef;
  @ViewChild('teamPerformanceChart') teamPerformanceChartRef!: ElementRef;

  private destroy$ = new Subject<void>();
  private updateSubscription?: Subscription;
  private followUpChart?: Chart;
  
  isLoading = false;
  currentUser = { name: 'John Doe' };
  
  statsCards: StatsCard[] = [
    {
      title: 'Total Follow-ups',
      value: 156,
      icon: 'bell',
      color: 'primary',
      change: 12.5,
      subtitle: 'vs last month'
    },
    {
      title: 'Completion Rate',
      value: '85%',
      icon: 'check-circle',
      color: 'success',
      change: 5.2,
      subtitle: 'vs last month'
    },
    {
      title: 'Pending Tasks',
      value: 24,
      icon: 'clock',
      color: 'warning',
      change: -8.4,
      subtitle: 'vs last month'
    },
    {
      title: 'Overdue Items',
      value: 5,
      icon: 'exclamation-circle',
      color: 'danger',
      change: -15.3,
      subtitle: 'vs last month'
    }
  ];
  
  recentFollowUps: FollowUp[] = [
    {
      id: '1',
      clientName: 'Acme Corp',
      type: 'Meeting',
      status: 'Completed',
      date: new Date(),
      nextDate: new Date(),
      priority: 'High',
      assignedName: 'John Doe',
      assignedAvatar: 'assets/avatars/john.jpg',
      channel: 'Email',
      description: 'Follow up on proposal'
    },
    {
      id: '2',
      clientName: 'Tech Solutions',
      type: 'Call',
      status: 'Pending',
      date: new Date(),
      nextDate: new Date(),
      priority: 'Medium',
      assignedName: 'Jane Smith',
      assignedAvatar: 'assets/avatars/jane.jpg',
      channel: 'Call',
      description: 'Quarterly review call'
    }
  ];
  
  teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'John Doe',
      role: 'Sales Manager',
      avatar: 'assets/avatars/john.jpg',
      progress: 85,
      status: 'success'
    },
    {
      id: 2,
      name: 'Jane Smith',
      role: 'Sales Representative',
      avatar: 'assets/avatars/jane.jpg',
      progress: 72,
      status: 'primary'
    },
    {
      id: 3,
      name: 'Mike Brown',
      role: 'Account Executive',
      avatar: 'assets/avatars/mike.jpg',
      progress: 64,
      status: 'warning'
    }
  ];
  
  quickActions: QuickAction[] = [
    { id: 'new-followup', title: 'New Follow-up', icon: 'plus-circle', link: '/follow-up/new' },
    { id: 'schedule', title: 'Schedule Meeting', icon: 'calendar-event', link: '/schedule' },
    { id: 'report', title: 'Generate Report', icon: 'file-earmark-text', link: '/reports' },
    { id: 'settings', title: 'Settings', icon: 'gear', link: '/settings' }
  ];
  
  aiInsights: AIInsight[] = [
    {
      icon: 'bi bi-graph-up',
      title: 'High Priority Follow-ups',
      description: '5 clients need immediate attention based on response patterns',
      type: 'warning',
      time: new Date()
    },
    {
      icon: 'bi bi-clock',
      title: 'Best Contact Time',
      description: 'Most clients respond between 10 AM and 2 PM',
      type: 'info',
      time: new Date()
    },
    {
      icon: 'bi bi-person-check',
      title: 'Engagement Opportunity',
      description: '3 clients showing increased interest in premium services',
      type: 'success',
      time: new Date()
    }
  ];

  // KPI Stats
  todayFollowUps = 12;
  pendingFollowUps = 45;
  overdueFollowUps = 8;
  completedFollowUps = 156;
  upcomingFollowUps = 23;
  totalClients = 487;

  // Timeline Data
  timelineDays: TimelineDay[] = [
    {
      date: new Date(),
      followUps: [
        {
          id: '2',
          clientName: 'Tech Solutions',
          type: 'Call',
          status: 'Pending',
          date: new Date(),
          nextDate: new Date(),
          priority: 'Medium',
          assignedName: 'Jane Smith',
          assignedAvatar: 'assets/avatars/user2.jpg',
          channel: 'Call',
          description: 'Quarterly review call'
        }
      ]
    }
  ];

  // Recent Communications
  recentCommunications: Communication[] = [
    {
      type: 'email',
      icon: 'fas fa-envelope',
      title: 'Proposal Sent',
      description: 'Sent updated proposal to Acme Corp',
      time: new Date()
    },
    {
      type: 'whatsapp',
      icon: 'fab fa-whatsapp',
      title: 'Meeting Confirmation',
      description: 'Confirmed tomorrow\'s meeting with Tech Solutions',
      time: new Date()
    }
  ];

  // Engaged Clients
  engagedClients: Client[] = [
    {
      name: 'Global Industries',
      lastInteraction: new Date(),
      score: 95,
      scoreClass: 'score-high'
    },
    {
      name: 'StartUp Hub',
      lastInteraction: new Date(),
      score: 75,
      scoreClass: 'score-medium'
    }
  ];

  // Usage Stats
  usageStats: UsageStats = {
    followUps: {
      used: 450,
      total: 1000,
      percentage: 45
    },
    storage: {
      used: '2.5 GB',
      total: '5 GB',
      percentage: 50
    }
  };

  // Notifications
  notifications: Notification[] = [
    {
      icon: 'fas fa-exclamation-circle',
      title: 'Overdue Follow-up',
      message: 'Follow-up with Acme Corp is overdue by 2 days',
      time: new Date()
    }
  ];

  // UI State
  showNotifications = false;
  showSubscriptionInfo = true;
  showUpgradeButton = true;

  // Charts
  private successRateChart?: Chart;
  private responseTimeChart?: Chart;
  private teamPerformanceChart?: Chart;

  constructor(private settingsService: SettingsService) {
    this.initializeData();
  }

  private initializeData(): void {
    this.isLoading = true;
    // Initialize your data here
    this.isLoading = false;
  }

  ngOnInit(): void {
    this.startAutoUpdate();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeCharts();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
    if (this.followUpChart) {
      this.followUpChart.destroy();
    }
    this.destroyCharts();
  }

  private initializeCharts(): void {
    if (this.successRateChartRef?.nativeElement) {
      this.initializeSuccessRateChart();
    }
    if (this.responseTimeChartRef?.nativeElement) {
      this.initializeResponseTimeChart();
    }
    if (this.teamPerformanceChartRef?.nativeElement) {
      this.initializeTeamPerformanceChart();
    }
  }

  private initializeSuccessRateChart(): void {
    const ctx = this.successRateChartRef?.nativeElement?.getContext('2d');
    if (!ctx) return;

    this.successRateChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'Pending', 'Overdue'],
        datasets: [{
          data: [this.completedFollowUps, this.pendingFollowUps, this.overdueFollowUps],
          backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              padding: 15,
              font: {
                size: 12
              }
            }
          }
        }
      }
    });
  }

  private initializeResponseTimeChart(): void {
    const ctx = this.responseTimeChartRef?.nativeElement?.getContext('2d');
    if (!ctx) return;

    this.responseTimeChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['< 1h', '1-4h', '4-24h', '> 24h'],
        datasets: [{
          label: 'Response Time',
          data: [30, 45, 15, 10],
          backgroundColor: '#3B82F6'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            border: {
              display: false
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
              display: true,
              lineWidth: 1
            },
            ticks: {
              padding: 10
            }
          },
          x: {
            border: {
              display: false
            },
            grid: {
              display: false,
              lineWidth: 0
            },
            ticks: {
              padding: 10
            }
          }
        }
      }
    });
  }

  private initializeTeamPerformanceChart(): void {
    const ctx = this.teamPerformanceChartRef?.nativeElement?.getContext('2d');
    if (!ctx) return;

    this.teamPerformanceChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [{
          label: 'Follow-ups Completed',
          data: [12, 19, 15, 17, 14],
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            border: {
              display: false
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
              display: true,
              lineWidth: 1
            },
            ticks: {
              padding: 10
            }
          },
          x: {
            border: {
              display: false
            },
            grid: {
              display: false,
              lineWidth: 0
            },
            ticks: {
              padding: 10
            }
          }
        }
      }
    });
  }

  private startAutoUpdate(): void {
    this.updateSubscription = interval(30000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateDashboardData();
      });
  }

  private updateDashboardData(): void {
    // Update your dashboard data here
    this.updateCharts();
  }

  private updateCharts(): void {
    if (this.successRateChart) {
      this.successRateChart.data.datasets[0].data = [
        this.completedFollowUps,
        this.pendingFollowUps,
        this.overdueFollowUps
      ];
      this.successRateChart.update();
    }
    // Update other charts similarly
  }

  getStatusColor(status: string): BadgeType {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'danger';
      default:
        return 'secondary';
    }
  }
  
  getPriorityColor(priority: string): BadgeType {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'secondary';
    }
  }

  private destroyCharts(): void {
    this.successRateChart?.destroy();
    this.responseTimeChart?.destroy();
    this.teamPerformanceChart?.destroy();
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  getActivityIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      create: 'bi bi-plus-circle',
      update: 'bi bi-pencil-square',
      delete: 'bi bi-trash',
      reminder: 'bi bi-bell'
    };
    return iconMap[type] || 'bi bi-circle';
  }

  getActivityIconClass(type: string): string {
    return `activity-${type}`;
  }

  getPriorityIcon(priority: string): string {
    const iconMap: { [key: string]: string } = {
      high: 'bi-exclamation-circle-fill',
      medium: 'bi-dash-circle-fill',
      low: 'bi-arrow-down-circle-fill'
    };
    return iconMap[priority] || 'bi-circle-fill';
  }
} 