import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type ColorType = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-card" [ngClass]="'bg-' + color + '-subtle'">
      <div class="stats-icon">
        <i [class]="icon"></i>
      </div>
      <div class="stats-content">
        <h3>{{ title }}</h3>
        <div class="stats-value">{{ value }}</div>
        <div class="stats-footer" *ngIf="change !== null">
          <span [ngClass]="change >= 0 ? 'text-success' : 'text-danger'">
            <i class="bi" [ngClass]="change >= 0 ? 'bi-arrow-up' : 'bi-arrow-down'"></i>
            {{ Math.abs(change) }}%
          </span>
          <span class="stats-subtitle">{{ subtitle }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-card {
      padding: 1.5rem;
      border-radius: 0.5rem;
      display: flex;
      gap: 1rem;
      height: 100%;
    }
    .stats-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.5rem;
      font-size: 1.5rem;
    }
    .stats-content {
      flex: 1;
    }
    .stats-content h3 {
      margin: 0;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--bs-gray-600);
    }
    .stats-value {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0.5rem 0;
    }
    .stats-footer {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
    }
    .stats-subtitle {
      color: var(--bs-gray-600);
    }
  `]
})
export class StatsCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() icon: string = '';
  @Input() color: ColorType = 'primary';
  @Input() change: number | null = null;
  @Input() subtitle: string = '';

  protected Math = Math;
} 