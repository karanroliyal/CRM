import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .card {
      background: var(--bs-card-bg, #fff);
      border: var(--bs-card-border-width, 1px) solid var(--bs-card-border-color, rgba(0,0,0,.125));
      border-radius: var(--bs-card-border-radius, 0.375rem);
      height: 100%;
    }
  `]
})
export class CardComponent {} 