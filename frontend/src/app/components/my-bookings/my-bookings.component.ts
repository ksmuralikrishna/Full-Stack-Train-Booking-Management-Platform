import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    MatDialogModule
  ],
  template: `
    <div class="bookings-container">
      <div class="bookings-header">
        <h1 class="page-title">
          <mat-icon>confirmation_number</mat-icon>
          My Bookings
        </h1>
      </div>
      
      <div class="loading-section" *ngIf="isLoading">
        <mat-spinner></mat-spinner>
        <p>Loading your bookings...</p>
      </div>
      
      <div class="bookings-grid" *ngIf="!isLoading && bookings.length > 0">
        <mat-card class="booking-card" *ngFor="let booking of bookings">
          <mat-card-header>
            <mat-card-title>{{ booking.train?.name }}</mat-card-title>
            <mat-card-subtitle>
              <mat-icon>schedule</mat-icon>
              {{ booking.train?.time }}
            </mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <div class="route-info">
              <div class="route">
                <span class="station">{{ booking.train?.source }}</span>
                <mat-icon class="arrow">arrow_forward</mat-icon>
                <span class="station">{{ booking.train?.destination }}</span>
              </div>
            </div>
            
            <div class="booking-details">
              <div class="detail-item">
                <mat-icon>event</mat-icon>
                <span><strong>Date:</strong> {{ booking.date }}</span>
              </div>
              
              <div class="detail-item">
                <mat-icon>event_seat</mat-icon>
                <span><strong>Seats:</strong></span>
                <mat-chip-set>
                  <mat-chip *ngFor="let seat of booking.seat_numbers">
                    Seat {{ seat }}
                  </mat-chip>
                </mat-chip-set>
              </div>
              
              <div class="detail-item">
                <mat-icon>access_time</mat-icon>
                <span><strong>Booked:</strong> {{ formatDateTime(booking.booking_time) }}</span>
              </div>
            </div>
          </mat-card-content>
          
          <mat-card-actions>
            <button 
              mat-raised-button 
              color="warn" 
              (click)="cancelBooking(booking.id)"
              [disabled]="isCancelling">
              <mat-spinner *ngIf="isCancelling" diameter="20"></mat-spinner>
              <mat-icon *ngIf="!isCancelling">cancel</mat-icon>
              {{ isCancelling ? 'Cancelling...' : 'Cancel Booking' }}
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
      
      <div class="no-bookings" *ngIf="!isLoading && bookings.length === 0">
        <mat-card class="no-bookings-card">
          <mat-card-content>
            <mat-icon>confirmation_number</mat-icon>
            <h3>No bookings found</h3>
            <p>You haven't made any bookings yet. Start exploring available trains!</p>
            <button mat-raised-button color="primary" routerLink="/trains">
              <mat-icon>directions_transit</mat-icon>
              Browse Trains
            </button>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .bookings-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }
    
    .bookings-header {
      margin-bottom: 24px;
    }
    
    .page-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 2rem;
      font-weight: 300;
      color: #3f51b5;
    }
    
    .loading-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 48px;
    }
    
    .bookings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 24px;
    }
    
    .booking-card {
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }
    
    .booking-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
    
    .route-info {
      margin-bottom: 16px;
    }
    
    .route {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.1rem;
    }
    
    .station {
      font-weight: 500;
    }
    
    .arrow {
      color: #3f51b5;
    }
    
    .booking-details {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .detail-item {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    
    .detail-item mat-icon {
      color: #3f51b5;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    
    .no-bookings {
      text-align: center;
      padding: 48px;
    }
    
    .no-bookings-card mat-card-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    
    .no-bookings mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #ccc;
    }
    
    @media (max-width: 768px) {
      .bookings-grid {
        grid-template-columns: 1fr;
      }
      
      .detail-item {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class MyBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  isLoading = false;
  isCancelling = false;

  constructor(
    private bookingService: BookingService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.isLoading = true;
    
    this.bookingService.getUserBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Failed to load bookings', 'Close', { duration: 3000 });
        console.error('Error loading bookings:', error);
      }
    });
  }

  cancelBooking(bookingId: number) {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.isCancelling = true;
      
      this.bookingService.cancelBooking(bookingId).subscribe({
        next: () => {
          this.isCancelling = false;
          this.snackBar.open('Booking cancelled successfully!', 'Close', { duration: 3000 });
          this.loadBookings();
        },
        error: (error) => {
          this.isCancelling = false;
          this.snackBar.open(error.error?.detail || 'Failed to cancel booking', 'Close', { duration: 3000 });
        }
      });
    }
  }

  formatDateTime(dateTime: string): string {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    return date.toLocaleString();
  }
}

