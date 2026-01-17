import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule
  ],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <button mat-icon-button (click)="sidenav.toggle()" class="menu-button">
        <mat-icon>menu</mat-icon>
      </button>
      
      <span class="app-title">
        <mat-icon>train</mat-icon>
        Train Booking
      </span>
      
      <span class="spacer"></span>
      
      <div class="nav-buttons">
        <button mat-button routerLink="/trains" routerLinkActive="active">
          <mat-icon>directions_transit</mat-icon>
          Trains
        </button>
        
        <button mat-button routerLink="/bookings" routerLinkActive="active" *ngIf="authService.isLoggedIn()">
          <mat-icon>confirmation_number</mat-icon>
          My Bookings
        </button>
      </div>
      
      <div class="auth-buttons" *ngIf="!authService.isLoggedIn()">
        <button mat-button routerLink="/login">Login</button>
        <button mat-raised-button color="accent" routerLink="/register">Register</button>
      </div>
      
      <div class="user-menu" *ngIf="authService.isLoggedIn()">
        <button mat-button [matMenuTriggerFor]="userMenu">
          <mat-icon>account_circle</mat-icon>
          {{ authService.getCurrentUser()?.name }}
          <mat-icon>arrow_drop_down</mat-icon>
        </button>
        
        <mat-menu #userMenu="matMenu">
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            Logout
          </button>
        </mat-menu>
      </div>
    </mat-toolbar>

    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav mode="side" class="sidenav">
        <mat-nav-list>
          <a mat-list-item routerLink="/" routerLinkActive="active">
            <mat-icon matListItemIcon>home</mat-icon>
            <span matListItemTitle>Home</span>
          </a>
          <a mat-list-item routerLink="/trains" routerLinkActive="active">
            <mat-icon matListItemIcon>directions_transit</mat-icon>
            <span matListItemTitle>Trains</span>
          </a>
          <a mat-list-item routerLink="/bookings" routerLinkActive="active" *ngIf="authService.isLoggedIn()">
            <mat-icon matListItemIcon>confirmation_number</mat-icon>
            <span matListItemTitle>My Bookings</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      
      <mat-sidenav-content class="main-content">
        <div class="content-wrapper">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .app-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    
    .menu-button {
      margin-right: 16px;
    }
    
    .app-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.2rem;
      font-weight: 500;
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    .nav-buttons {
      display: flex;
      gap: 8px;
    }
    
    .auth-buttons {
      display: flex;
      gap: 8px;
    }
    
    .user-menu {
      display: flex;
      align-items: center;
    }
    
    .sidenav-container {
      height: calc(100vh - 64px);
    }
    
    .sidenav {
      width: 250px;
    }
    
    .main-content {
      padding: 0;
    }
    
    .content-wrapper {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .active {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    @media (max-width: 768px) {
      .nav-buttons {
        display: none;
      }
      
      .content-wrapper {
        padding: 16px;
      }
    }
  `]
})
export class AppComponent {
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}

