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
  selector: 'app-login',
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
    <div class="login-container">
      <div class="login-card">
        <mat-card>
          <mat-card-header>
            <mat-card-title class="login-title">
              <mat-icon>login</mat-icon>
              Login
            </mat-card-title>
          </mat-card-header>
          
          <mat-card-content>
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email" placeholder="Enter your email">
                <mat-icon matSuffix>email</mat-icon>
                <mat-error *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
                  Please enter a valid email address
                </mat-error>
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Password</mat-label>
                <input matInput type="password" formControlName="password" placeholder="Enter your password">
                <mat-icon matSuffix>lock</mat-icon>
                <mat-error *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                  Password is required
                </mat-error>
              </mat-form-field>
              
              <button
                mat-raised-button
                color="primary"
                type="submit"
                class="login-button"
                [disabled]="loginForm.invalid || isLoading">
                <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
                <mat-icon *ngIf="!isLoading">home</mat-icon>
                {{ isLoading ? 'Logging in...' : 'Login' }}
              </button>
            </form>
          </mat-card-content>
          
          <mat-card-actions>
            <div class="register-link">
              <p>Don't have an account?</p>
              <button mat-button color="primary" routerLink="/register">
                <mat-icon>person_add</mat-icon>
                Register here
              </button>
            </div>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
      padding: 24px;
    }
    
    .login-card {
      width: 100%;
      max-width: 400px;
    }
    
    .login-title {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: center;
      font-size: 1.5rem;
      color: #3f51b5;
    }
    
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .full-width {
      width: 100%;
    }
    
    .login-button {
      width: 100%;
      height: 48px;
      font-size: 1rem;
    }
    
    .register-link {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      width: 100%;
    }
    
    .register-link p {
      margin: 0;
      color: #666;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.snackBar.open('Login successful!', 'Close', { duration: 2000 });
          this.router.navigate(['/trains']);
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(error.error?.detail || 'Login failed. Please try again.', 'Close', { duration: 3000 });
        }
      });
    }
  }
}

