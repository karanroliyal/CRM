import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TableColumn {
  key: string;
  title: string;
  sortable?: boolean;
  type?: 'text' | 'date' | 'number' | 'boolean' | 'currency' | 'custom';
  formatter?: (value: any, row: any) => string;
  width?: string;
  class?: string;
}

export interface SortEvent {
  column: string;
  direction: 'asc' | 'desc';
}

export interface PaginationEvent {
  pageIndex: number;
  pageSize: number;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnChanges {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() loading: boolean = false;
  @Input() pageSize: number = 10;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50];
  @Input() showPagination: boolean = true;
  @Input() totalItems: number = 0;
  @Input() currentPage: number = 0;
  @Input() sortable: boolean = true;
  @Input() striped: boolean = true;
  @Input() hover: boolean = true;
  @Input() bordered: boolean = false;
  @Input() showSearch: boolean = true;
  @Input() emptyMessage: string = 'No data available';
  @Input() selectable: boolean = false;

  @Output() rowClick = new EventEmitter<any>();
  @Output() pageChange = new EventEmitter<PaginationEvent>();
  @Output() sort = new EventEmitter<SortEvent>();
  @Output() search = new EventEmitter<string>();
  @Output() selectionChange = new EventEmitter<any[]>();

  searchText: string = '';
  selectedRows: any[] = [];
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  pageSizeSelected: number = this.pageSize;
  totalPages: number = 0;
  displayedData: any[] = [];
  allSelected: boolean = false;
  Math = Math; // Make Math available to the template

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalItems'] || changes['pageSize']) {
      this.calculateTotalPages();
    }

    if (changes['data']) {
      this.updateDisplayedData();
    }

    if (changes['pageSize']) {
      this.pageSizeSelected = this.pageSize;
    }
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
  }

  updateDisplayedData(): void {
    // If server-side pagination is being used, the data is already paginated
    this.displayedData = [...this.data];
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.pageChange.emit({
        pageIndex: this.currentPage,
        pageSize: this.pageSizeSelected
      });
    }
  }

  onPageSizeChange(): void {
    this.calculateTotalPages();
    // If current page is now out of bounds, reset to first page
    if (this.currentPage >= this.totalPages) {
      this.currentPage = 0;
    }
    this.pageChange.emit({
      pageIndex: this.currentPage,
      pageSize: this.pageSizeSelected
    });
  }

  onSearchChange(): void {
    this.search.emit(this.searchText);
  }

  onSort(column: TableColumn): void {
    if (!column.sortable || !this.sortable) return;

    if (this.sortColumn === column.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column.key;
      this.sortDirection = 'asc';
    }

    this.sort.emit({
      column: this.sortColumn,
      direction: this.sortDirection
    });
  }

  getSortClass(column: TableColumn): string {
    if (!column.sortable || !this.sortable) return '';

    if (this.sortColumn === column.key) {
      return this.sortDirection === 'asc' ? 'sort-asc' : 'sort-desc';
    }
    return 'sort';
  }

  onRowClick(row: any): void {
    this.rowClick.emit(row);
  }

  toggleSelectAll(): void {
    this.allSelected = !this.allSelected;
    this.selectedRows = this.allSelected ? [...this.displayedData] : [];
    this.selectionChange.emit(this.selectedRows);
  }

  toggleSelectRow(row: any, event: Event): void {
    event.stopPropagation();
    const index = this.selectedRows.findIndex(selectedRow => selectedRow === row);
    
    if (index > -1) {
      this.selectedRows.splice(index, 1);
    } else {
      this.selectedRows.push(row);
    }
    
    this.allSelected = this.selectedRows.length === this.displayedData.length;
    this.selectionChange.emit(this.selectedRows);
  }

  isRowSelected(row: any): boolean {
    return this.selectedRows.includes(row);
  }

  getFormattedCellData(row: any, column: TableColumn): string {
    const value = row[column.key];
    
    if (column.formatter) {
      return column.formatter(value, row);
    }

    if (value === null || value === undefined) {
      return '-';
    }

    switch (column.type) {
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'currency':
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
      case 'boolean':
        return value ? 'Yes' : 'No';
      default:
        return String(value);
    }
  }

  getPages(): number[] {
    const visiblePages = 5;
    const pages: number[] = [];
    
    let startPage = Math.max(0, this.currentPage - Math.floor(visiblePages / 2));
    let endPage = startPage + visiblePages - 1;
    
    if (endPage >= this.totalPages) {
      endPage = this.totalPages - 1;
      startPage = Math.max(0, endPage - visiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
} 