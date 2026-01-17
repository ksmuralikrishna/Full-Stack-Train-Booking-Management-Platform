import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="register-container">
      <div class="register-card">
        <mat-card>
          <mat-card-header>
            <mat-card-title class="register-title">
              <mat-icon>person_add</mat-icon>
              Register
            </mat-card-title>
          </mat-card-header>
          
          <mat-card-content>
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Full Name</mat-label>
                <input matInput type="text" formControlName="name" placeholder="Enter your full name">
                <mat-icon matSuffix>person</mat-icon>
                <mat-error *ngIf="registerForm.get('name')?.invalid && registerForm.get('name')?.touched">
                  Name is required
                </mat-error>
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email" placeholder="Enter your email">
                <mat-icon matSuffix>email</mat-icon>
                <mat-error *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
                  Please enter a valid email address
                </mat-error>
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Password</mat-label>
                <input matInput type="password" formControlName="password" placeholder="Enter your password">
                <mat-icon matSuffix>lock</mat-icon>
                <mat-error *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
                  Password must be at least 6 characters long
                </mat-error>
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Confirm Password</mat-label>
                <input matInput type="password" formControlName="confirmPassword" placeholder="Confirm your password">
                <mat-icon matSuffix>lock</mat-icon>
                <mat-error *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched">
                  Passwords do not match
                </mat-error>
              </mat-form-field>
              
              <button
                mat-raised-button
                color="primary"
                type="submit"
                class="register-button"
                [disabled]="registerForm.invalid || isLoading">
                <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
                <mat-icon *ngIf="!isLoading">person_add</mat-icon>
                {{ isLoading ? 'Creating Account...' : 'Register' }}
              </button>
            </form>
          </mat-card-content>
          
          <mat-card-actions>
            <div class="login-link">
              <p>Already have an account?</p>
              <button mat-button color="primary" routerLink="/login">
                <mat-icon>login</mat-icon>
                Login here
              </button>
            </div>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
      padding: 24px;
    }
    
    .register-card {
      width: 100%;
      max-width: 400px;
    }
    
    .register-title {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: center;
      font-size: 1.5rem;
      color: #3f51b5;
    }
    
    .register-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .full-width {
      width: 100%;
    }
    
    .register-button {
      width: 100%;
      height: 48px;
      font-size: 1rem;
    }
    
    .login-link {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      width: 100%;
    }
    
    .login-link p {
      margin: 0;
      color: #666;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      if (confirmPassword?.hasError('passwordMismatch')) {
        confirmPassword.setErrors(null);
      }
    }
    
    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      
      const { confirmPassword, ...userData } = this.registerForm.value;
      
      this.authService.register(userData).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('Account created successfully! Please login.', 'Close', { duration: 3000 });
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(error.error?.detail || 'Registration failed. Please try again.', 'Close', { duration: 3000 });
        }
      });
    }
  }
}

