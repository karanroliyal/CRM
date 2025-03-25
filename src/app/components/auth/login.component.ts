import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;
  loginError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  isFieldInvalid(field: string): boolean {
    const formControl = this.loginForm.get(field);
    return formControl ? formControl.invalid && (formControl.dirty || formControl.touched) : false;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.loginError = null;
      
      // Simulate API call
      setTimeout(() => {
        const { email, password } = this.loginForm.value;
        
        // Simple validation for demo purposes
        if (email === 'admin@example.com' && password === 'password123') {
          // Store auth token
          localStorage.setItem('authToken', 'demo-token-12345');
          
          // Store remember me preference
          if (this.loginForm.value.rememberMe) {
            localStorage.setItem('rememberUser', email);
          } else {
            localStorage.removeItem('rememberUser');
          }
          
          // Navigate to dashboard
          this.router.navigate(['/dashboard']);
        } else {
          this.loginError = 'Invalid email or password';
        }
        
        this.isLoading = false;
      }, 1500);
    } else {
      // Mark all fields as touched to trigger validation
      this.loginForm.markAllAsTouched();
    }
  }
} 