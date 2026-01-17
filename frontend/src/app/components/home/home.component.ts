import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
    MatGridListModule
  ],
  template: `
    <div class="home-container">
      <div class="hero-section">
        <h1 class="hero-title">
          <mat-icon class="hero-icon">train</mat-icon>
          Welcome to Train Booking
        </h1>
        <p class="hero-subtitle">
          Book your train tickets easily and securely. Find the perfect train for your journey 
          and reserve your seat in just a few clicks.
        </p>
      </div>
      
      <mat-grid-list cols="3" rowHeight="200px" gutterSize="16px" class="features-grid">
        <mat-grid-tile>
          <mat-card class="feature-card">
            <mat-card-content>
              <div class="feature-content">
                <mat-icon class="feature-icon">search</mat-icon>
                <h3>Find Trains</h3>
                <p>Browse available trains and their schedules with advanced search and filters.</p>
                <button mat-raised-button color="primary" routerLink="/trains">
                  View Trains
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
        
        <mat-grid-tile>
          <mat-card class="feature-card">
            <mat-card-content>
              <div class="feature-content">
                <mat-icon class="feature-icon">event_seat</mat-icon>
                <h3>Book Tickets</h3>
                <p>Reserve your seat on your preferred train with interactive seat selection.</p>
                <button mat-raised-button color="primary" routerLink="/trains">
                  Book Now
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
        
        <mat-grid-tile>
          <mat-card class="feature-card">
            <mat-card-content>
              <div class="feature-content">
                <mat-icon class="feature-icon">confirmation_number</mat-icon>
                <h3>Manage Bookings</h3>
                <p>View and manage your existing bookings with easy cancellation options.</p>
                <button 
                  mat-raised-button 
                  color="primary" 
                  routerLink="/bookings" 
                  *ngIf="authService.isLoggedIn()">
                  My Bookings
                </button>
                <button 
                  mat-stroked-button 
                  color="primary" 
                  routerLink="/login" 
                  *ngIf="!authService.isLoggedIn()">
                  Login First
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
      </mat-grid-list>
      
      <div class="cta-section" *ngIf="!authService.isLoggedIn()">
        <mat-card class="cta-card">
          <mat-card-content>
            <h2>Get Started Today</h2>
            <p>Create an account to start booking your train tickets and enjoy a seamless travel experience.</p>
            <div class="cta-buttons">
              <button mat-raised-button color="accent" routerLink="/register" class="cta-button">
                <mat-icon>person_add</mat-icon>
                Register
              </button>
              <button mat-stroked-button color="primary" routerLink="/login" class="cta-button">
                <mat-icon>login</mat-icon>
                Login
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }
    
    .hero-section {
      text-align: center;
      margin-bottom: 48px;
    }
    
    .hero-title {
      font-size: 3rem;
      font-weight: 300;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
    }
    
    .hero-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
    }
    
    .hero-subtitle {
      font-size: 1.2rem;
      color: #666;
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }
    
    .features-grid {
      margin-bottom: 48px;
    }
    
    .feature-card {
      height: 100%;
      width: 100%;
    }
    
    .feature-content {
      text-align: center;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    
    .feature-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      color: #3f51b5;
      margin-bottom: 16px;
    }
    
    .feature-content h3 {
      margin: 0 0 8px 0;
      font-size: 1.2rem;
    }
    
    .feature-content p {
      margin: 0 0 16px 0;
      color: #666;
      flex-grow: 1;
    }
    
    .cta-section {
      text-align: center;
    }
    
    .cta-card {
      max-width: 600px;
      margin: 0 auto;
    }
    
    .cta-card h2 {
      margin-bottom: 16px;
      color: #3f51b5;
    }
    
    .cta-card p {
      margin-bottom: 24px;
      color: #666;
      font-size: 1.1rem;
    }
    
    .cta-buttons {
      display: flex;
      gap: 16px;
      justify-content: center;
    }
    
    .cta-button {
      min-width: 120px;
    }
    
    @media (max-width: 768px) {
      .hero-title {
        font-size: 2rem;
        flex-direction: column;
        gap: 8px;
      }
      
      .hero-icon {
        font-size: 2rem;
        width: 2rem;
        height: 2rem;
      }
      
      .features-grid {
        display: block;
      }
      
      .feature-card {
        margin-bottom: 16px;
      }
      
      .cta-buttons {
        flex-direction: column;
        align-items: center;
      }
    }
  `]
})
export class HomeComponent {
  constructor(public authService: AuthService) {}
}

