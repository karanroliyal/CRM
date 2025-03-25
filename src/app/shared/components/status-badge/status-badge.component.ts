import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type BadgeType = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [ngClass]="'bg-' + type">
      {{ text }}
    </span>
  `,
  styles: [`
    .badge {
      padding: 0.35em 0.65em;
      font-size: 0.85em;
      font-weight: 500;
      border-radius: 4px;
      text-transform: capitalize;
    }
  `]
})
export class StatusBadgeComponent {
  @Input() text: string = '';
  @Input() type: BadgeType = 'primary';
} 