import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MainLayoutComponent } from './main-layout.component';

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MainLayoutComponent,
        RouterTestingModule
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle theme', () => {
    // Initial state
    expect(component.isDarkTheme).toBeFalsy();
    
    // Toggle theme
    component.toggleTheme();
    expect(component.isDarkTheme).toBeTruthy();
    
    // Toggle theme again
    component.toggleTheme();
    expect(component.isDarkTheme).toBeFalsy();
  });

  it('should toggle sidebar', () => {
    // Get initial state (depends on window.innerWidth)
    const initialState = component.isSidebarCollapsed;
    
    // Toggle sidebar
    component.toggleSidebar();
    expect(component.isSidebarCollapsed).not.toEqual(initialState);
    
    // Toggle sidebar again
    component.toggleSidebar();
    expect(component.isSidebarCollapsed).toEqual(initialState);
  });
}); 