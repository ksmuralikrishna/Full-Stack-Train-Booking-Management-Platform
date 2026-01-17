import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { TrainService } from '../../services/train.service';
import { BookingService } from '../../services/booking.service';
import { Train, SeatAvailability } from '../../models/train.model';
import { BookingCreate } from '../../models/booking.model';
import { SeatMapComponent } from '../seat-map/seat-map.component';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatStepperModule,
    SeatMapComponent
  ],
  template: `
    <div class="booking-container">
      <div class="booking-header">
        <h1 class="page-title">
          <mat-icon>event_seat</mat-icon>
          Book Your Seats
        </h1>
      </div>
      
      <div class="loading-section" *ngIf="isLoading && !train">
        <mat-spinner></mat-spinner>
        <p>Loading train details...</p>
      </div>
      
      <div *ngIf="train" class="booking-content">
        <!-- Train Information -->
        <mat-card class="train-info-card">
          <mat-card-header>
            <mat-card-title>{{ train.name }}</mat-card-title>
            <mat-card-subtitle>
              <mat-icon>schedule</mat-icon>
              {{ train.time }}
            </mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="route-info">
              <div class="route">
                <span class="station">{{ train.source }}</span>
                <mat-icon class="arrow">arrow_forward</mat-icon>
                <span class="station">{{ train.destination }}</span>
              </div>
            </div>
            <div class="seat-summary">
              <mat-icon>event_seat</mat-icon>
              <span>{{ seatAvailability?.available_count || 0 }} / {{ train.total_seats }} seats available</span>
            </div>
          </mat-card-content>
        </mat-card>
        
        <!-- Booking Steps -->
        <mat-stepper #stepper class="booking-stepper">
          <!-- Step 1: Select Date -->
          <mat-step [stepControl]="dateForm">
            <ng-template matStepLabel>Select Travel Date</ng-template>
            <form [formGroup]="dateForm" (ngSubmit)="onDateSubmit()">
              <div class="step-content">
                <mat-form-field appearance="outline" class="date-field">
                  <mat-label>Travel Date</mat-label>
                  <input matInput [matDatepicker]="picker" formControlName="date">
                  <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                  <mat-datepicker #picker></mat-datepicker>
                </mat-form-field>
                <div class="step-actions">
                  <button mat-raised-button color="primary" type="submit" [disabled]="dateForm.invalid">
                    Next: Select Seats
                  </button>
                </div>
              </div>
            </form>
          </mat-step>
          
          <!-- Step 2: Select Seats -->
          <mat-step [stepControl]="seatForm">
            <ng-template matStepLabel>Select Seats</ng-template>
            <form [formGroup]="seatForm">
              <div class="step-content">
                <app-seat-map
                  *ngIf="seatAvailability"
                  [totalSeats]="seatAvailability.total_seats"
                  [bookedSeats]="seatAvailability.booked_seats"
                  [maxSelections]="6"
                  (seatsSelected)="onSeatsSelected($event)">
                </app-seat-map>
                <div class="step-actions">
                  <button mat-stroked-button (click)="stepper.previous()">
                    <mat-icon>arrow_back</mat-icon>
                    Back
                  </button>
                  <button 
                    mat-raised-button 
                    color="primary" 
                    (click)="stepper.next()"
                    [disabled]="selectedSeats.length === 0">
                    Next: Confirm Booking
                  </button>
                </div>
              </div>
            </form>
          </mat-step>
          
          <!-- Step 3: Confirm Booking -->
          <mat-step>
            <ng-template matStepLabel>Confirm Booking</ng-template>
            <div class="step-content">
              <mat-card class="booking-summary">
                <mat-card-header>
                  <mat-card-title>Booking Summary</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="summary-item">
                    <mat-icon>train</mat-icon>
                    <span><strong>Train:</strong> {{ train.name }}</span>
                  </div>
                  <div class="summary-item">
                    <mat-icon>place</mat-icon>
                    <span><strong>Route:</strong> {{ train.source }} → {{ train.destination }}</span>
                  </div>
                  <div class="summary-item">
                    <mat-icon>schedule</mat-icon>
                    <span><strong>Departure:</strong> {{ train.time }}</span>
                  </div>
                  <div class="summary-item">
                    <mat-icon>event</mat-icon>
                    <span><strong>Date:</strong> {{ selectedDate }}</span>
                  </div>
                  <div class="summary-item">
                    <mat-icon>event_seat</mat-icon>
                    <span><strong>Seats:</strong> {{ selectedSeats.join(', ') }}</span>
                  </div>
                </mat-card-content>
              </mat-card>
              
              <div class="step-actions">
                <button mat-stroked-button (click)="stepper.previous()">
                  <mat-icon>arrow_back</mat-icon>
                  Back
                </button>
                <button 
                  mat-raised-button 
                  color="primary" 
                  (click)="confirmBooking()"
                  [disabled]="isBooking">
                  <mat-spinner *ngIf="isBooking" diameter="20"></mat-spinner>
                  <mat-icon *ngIf="!isBooking">check</mat-icon>
                  {{ isBooking ? 'Booking...' : 'Confirm Booking' }}
                </button>
              </div>
            </div>
          </mat-step>
        </mat-stepper>
      </div>
    </div>
  `,
  styles: [`
    .booking-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 24px;
    }
    
    .booking-header {
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
    
    .train-info-card {
      margin-bottom: 24px;
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
    
    .seat-summary {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }
    
    .booking-stepper {
      margin-top: 24px;
    }
    
    .step-content {
      padding: 24px 0;
    }
    
    .date-field {
      width: 100%;
      max-width: 300px;
    }
    
    .step-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 24px;
    }
    
    .booking-summary {
      margin-bottom: 24px;
    }
    
    .summary-item {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
      padding: 8px 0;
    }
    
    .summary-item mat-icon {
      color: #3f51b5;
    }
    
    @media (max-width: 768px) {
      .step-actions {
        flex-direction: column;
      }
      
      .date-field {
        width: 100%;
      }
    }
  `]
})
export class BookingComponent implements OnInit {
  train: Train | null = null;
  seatAvailability: SeatAvailability | null = null;
  dateForm: FormGroup;
  seatForm: FormGroup;
  isLoading = false;
  isBooking = false;
  selectedSeats: number[] = [];
  selectedDate = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private trainService: TrainService,
    private bookingService: BookingService,
    private snackBar: MatSnackBar
  ) {
    this.dateForm = this.fb.group({
      date: ['', [Validators.required]]
    });
    
    this.seatForm = this.fb.group({
      seats: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    const trainId = this.route.snapshot.paramMap.get('id');
    if (trainId) {
      this.loadTrain(parseInt(trainId));
    }
  }

  loadTrain(trainId: number) {
    this.isLoading = true;
    
    this.trainService.getTrains().subscribe({
      next: (trains) => {
        this.train = trains.find(t => t.id === trainId) || null;
        this.isLoading = false;
        
        if (!this.train) {
          this.snackBar.open('Train not found', 'Close', { duration: 3000 });
          this.router.navigate(['/trains']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Failed to load train details', 'Close', { duration: 3000 });
        console.error('Error loading train:', error);
      }
    });
  }

  onDateSubmit() {
    if (this.dateForm.valid && this.train) {
      const date = this.formatDate(this.dateForm.value.date);
      this.selectedDate = date;
      this.loadSeatAvailability(this.train.id, date);
    }
  }

  loadSeatAvailability(trainId: number, date: string) {
    this.isLoading = true;
    
    this.trainService.getTrainSeats(trainId, date).subscribe({
      next: (availability) => {
        this.seatAvailability = availability;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Failed to load seat availability', 'Close', { duration: 3000 });
        console.error('Error loading seat availability:', error);
      }
    });
  }

  onSeatsSelected(seats: number[]) {
    this.selectedSeats = seats;
    this.seatForm.patchValue({ seats: seats });
  }

  confirmBooking() {
    if (this.train && this.selectedSeats.length > 0 && this.selectedDate) {
      this.isBooking = true;
      
      const bookingData: BookingCreate = {
        train_id: this.train.id,
        seat_numbers: this.selectedSeats,
        date: this.selectedDate
      };
      
      this.bookingService.bookTicket(bookingData).subscribe({
        next: () => {
          this.isBooking = false;
          this.snackBar.open('Tickets booked successfully!', 'Close', { duration: 3000 });
          setTimeout(() => {
            this.router.navigate(['/bookings']);
          }, 2000);
        },
        error: (error) => {
          this.isBooking = false;
          this.snackBar.open(error.error?.detail || 'Booking failed. Please try again.', 'Close', { duration: 3000 });
        }
      });
    }
  }

  private formatDate(date: Date): string {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  }
}

