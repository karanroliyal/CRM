import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" [class]="customClass">
      <div class="card-header" *ngIf="showHeader">
        <ng-content select="[card-header]"></ng-content>
      </div>
      <div class="card-body">
        <ng-content></ng-content>
      </div>
      <div class="card-footer" *ngIf="showFooter">
        <ng-content select="[card-footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    .card {
      background: var(--bs-body-bg);
      border-radius: var(--card-border-radius, 0.5rem);
      box-shadow: var(--card-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
      transition: all var(--transition-speed, 0.2s) ease;
    }

    .card:hover {
      box-shadow: var(--card-hover-shadow, 0 4px 8px rgba(0, 0, 0, 0.15));
      transform: translateY(-2px);
    }

    .card-header {
      padding: 1rem;
      border-bottom: 1px solid var(--bs-border-color);
    }

    .card-body {
      padding: 1rem;
    }

    .card-footer {
      padding: 1rem;
      border-top: 1px solid var(--bs-border-color);
    }
  `]
})
export class CardComponent {
  @Input() customClass = '';
  @Input() showHeader = true;
  @Input() showFooter = true;
} 