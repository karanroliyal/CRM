import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        RouterTestingModule
      ]
    }).compileComponents();
    
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with invalid form', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should validate email field', () => {
    const emailControl = component.loginForm.get('email');
    expect(emailControl?.valid).toBeFalsy();
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();
    
    emailControl?.setValue('valid@example.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should validate password field', () => {
    const passwordControl = component.loginForm.get('password');
    expect(passwordControl?.valid).toBeFalsy();
    
    passwordControl?.setValue('12345');
    expect(passwordControl?.hasError('minlength')).toBeTruthy();
    
    passwordControl?.setValue('123456');
    expect(passwordControl?.valid).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBeFalsy();
    
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeTruthy();
    
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeFalsy();
  });

  it('should handle successful login', fakeAsync(() => {
    spyOn(router, 'navigate');
    component.loginForm.setValue({
      email: 'admin@example.com',
      password: 'password123',
      rememberMe: false
    });
    
    component.onSubmit();
    expect(component.isLoading).toBeTruthy();
    
    tick(1500);
    
    expect(component.isLoading).toBeFalsy();
    expect(component.loginError).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  }));

  it('should handle failed login', fakeAsync(() => {
    spyOn(router, 'navigate');
    component.loginForm.setValue({
      email: 'wrong@example.com',
      password: 'wrongpassword',
      rememberMe: false
    });
    
    component.onSubmit();
    expect(component.isLoading).toBeTruthy();
    
    tick(1500);
    
    expect(component.isLoading).toBeFalsy();
    expect(component.loginError).toBe('Invalid email or password');
    expect(router.navigate).not.toHaveBeenCalled();
  }));
});