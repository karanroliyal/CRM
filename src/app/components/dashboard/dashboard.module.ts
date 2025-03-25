import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DashboardComponent } from './dashboard.component';
import { StatsCardComponent } from '../../shared/components/stats-card/stats-card.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    DragDropModule,
    DashboardComponent,
    StatsCardComponent,
    StatusBadgeComponent,
    CardComponent,
    LoaderComponent
  ],
  exports: [DashboardComponent]
})
export class DashboardModule { } 