import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { TrainService } from '../../services/train.service';
import { Train, TrainSearchParams } from '../../models/train.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-train-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule
  ],
  template: `
    <div class="train-list-container">
      <div class="header-section">
        <h1 class="page-title">
          <mat-icon>directions_transit</mat-icon>
          Available Trains
        </h1>
        
        <mat-expansion-panel class="search-panel">
          <mat-expansion-panel-header>
            <mat-panel-title>
              <mat-icon>search</mat-icon>
              Search & Filter Trains
            </mat-panel-title>
          </mat-expansion-panel-header>
          
          <form [formGroup]="searchForm" (ngSubmit)="searchTrains()">
            <div class="search-form">
              <mat-form-field appearance="outline">
                <mat-label>From</mat-label>
                <input matInput formControlName="source" placeholder="Source station">
                <mat-icon matSuffix>place</mat-icon>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>To</mat-label>
                <input matInput formControlName="destination" placeholder="Destination station">
                <mat-icon matSuffix>place</mat-icon>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Travel Date</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="date">
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Minimum Seats</mat-label>
                <mat-select formControlName="min_seats">
                  <mat-option [value]="1">1+ seats</mat-option>
                  <mat-option [value]="2">2+ seats</mat-option>
                  <mat-option [value]="4">4+ seats</mat-option>
                  <mat-option [value]="6">6+ seats</mat-option>
                </mat-select>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Time Range</mat-label>
                <mat-select formControlName="time_range">
                  <mat-option value="">Any time</mat-option>
                  <mat-option value="06:00-12:00">Morning (6 AM - 12 PM)</mat-option>
                  <mat-option value="12:00-18:00">Afternoon (12 PM - 6 PM)</mat-option>
                  <mat-option value="18:00-23:59">Evening (6 PM - 12 AM)</mat-option>
                </mat-select>
              </mat-form-field>
              
              <div class="search-buttons">
                <button mat-raised-button color="primary" type="submit" [disabled]="isLoading">
                  <mat-icon>search</mat-icon>
                  Search
                </button>
                <button mat-stroked-button type="button" (click)="clearSearch()">
                  <mat-icon>clear</mat-icon>
                  Clear
                </button>
              </div>
            </div>
          </form>
        </mat-expansion-panel>
      </div>
      
        <div class="info-section" *ngIf="!authService.isLoggedIn()">
          <mat-card class="info-card">
            <mat-card-content>
              <mat-icon>info</mat-icon>
              <span>You need to <a routerLink="/login">login</a> to book tickets.</span>
            </mat-card-content>
          </mat-card>
        </div>
      
      <div class="loading-section" *ngIf="isLoading">
        <mat-spinner></mat-spinner>
        <p>Loading trains...</p>
      </div>
      
      <div class="trains-grid" *ngIf="!isLoading && trains.length > 0">
        <mat-card class="train-card" *ngFor="let train of trains">
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
            
            <div class="seat-info">
              <div class="seat-count">
                <mat-icon>event_seat</mat-icon>
                <span>{{ train.available_seats }} / {{ train.total_seats }} seats available</span>
              </div>
              
              <div class="seat-chips" *ngIf="train.booked_seats.length > 0">
                <mat-chip-set>
                  <mat-chip *ngFor="let seat of train.booked_seats.slice(0, 5)">
                    Seat {{ seat }}
                  </mat-chip>
                  <mat-chip *ngIf="train.booked_seats.length > 5">
                    +{{ train.booked_seats.length - 5 }} more
                  </mat-chip>
                </mat-chip-set>
              </div>
            </div>
          </mat-card-content>
          
          <mat-card-actions>
            <button 
              mat-raised-button 
              color="primary" 
              [disabled]="!authService.isLoggedIn() || train.available_seats === 0"
              (click)="bookTrain(train.id)">
              <mat-icon>event_seat</mat-icon>
              Book Seats
            </button>
            <button mat-stroked-button (click)="viewSeats(train.id)">
              <mat-icon>visibility</mat-icon>
              View Seats
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
      
      <div class="no-results" *ngIf="!isLoading && trains.length === 0">
        <mat-card class="no-results-card">
          <mat-card-content>
            <mat-icon>train</mat-icon>
            <h3>No trains found</h3>
            <p>Try adjusting your search criteria or check back later for new trains.</p>
            <button mat-raised-button color="primary" (click)="clearSearch()">
              Clear Filters
            </button>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .train-list-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }
    
    .header-section {
      margin-bottom: 24px;
    }
    
    .page-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 2rem;
      font-weight: 300;
      margin-bottom: 16px;
      color: #3f51b5;
    }
    
    .search-panel {
      margin-bottom: 24px;
    }
    
    .search-form {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      align-items: end;
    }
    
    .search-buttons {
      display: flex;
      gap: 12px;
      grid-column: 1 / -1;
      justify-content: center;
    }
    
    .info-section {
      margin-bottom: 24px;
    }
    
    .info-card {
      background-color: #e3f2fd;
    }
    
    .info-card mat-card-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .loading-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 48px;
    }
    
    .trains-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }
    
    .train-card {
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }
    
    .train-card:hover {
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
    
    .seat-info {
      margin-bottom: 16px;
    }
    
    .seat-count {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      font-weight: 500;
    }
    
    .seat-chips {
      margin-top: 8px;
    }
    
    .no-results {
      text-align: center;
      padding: 48px;
    }
    
    .no-results-card mat-card-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    
    .no-results mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #ccc;
    }
    
    @media (max-width: 768px) {
      .search-form {
        grid-template-columns: 1fr;
      }
      
      .trains-grid {
        grid-template-columns: 1fr;
      }
      
      .search-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class TrainListComponent implements OnInit {
  trains: Train[] = [];
  isLoading = false;
  errorMessage = '';
  searchForm: FormGroup;

  constructor(
    private trainService: TrainService,
    public authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.searchForm = this.fb.group({
      source: [''],
      destination: [''],
      date: [''],
      min_seats: [''],
      time_range: ['']
    });
  }

  ngOnInit() {
    this.loadTrains();
  }

  loadTrains() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.trainService.getTrains().subscribe({
      next: (trains) => {
        this.trains = trains;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load trains. Please try again.';
        this.snackBar.open('Failed to load trains', 'Close', { duration: 3000 });
        console.error('Error loading trains:', error);
      }
    });
  }

  searchTrains() {
    if (this.searchForm.invalid) return;
    
    this.isLoading = true;
    const searchParams: TrainSearchParams = {};
    
    const formValue = this.searchForm.value;
    if (formValue.source) searchParams.source = formValue.source;
    if (formValue.destination) searchParams.destination = formValue.destination;
    if (formValue.date) searchParams.date = this.formatDate(formValue.date);
    if (formValue.min_seats) searchParams.min_seats = formValue.min_seats;
    if (formValue.time_range) searchParams.time_range = formValue.time_range;
    
    this.trainService.getTrains(searchParams).subscribe({
      next: (trains) => {
        this.trains = trains;
        this.isLoading = false;
        this.snackBar.open(`Found ${trains.length} trains`, 'Close', { duration: 2000 });
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Search failed', 'Close', { duration: 3000 });
        console.error('Error searching trains:', error);
      }
    });
  }

  clearSearch() {
    this.searchForm.reset();
    this.loadTrains();
  }

  bookTrain(trainId: number) {
    if (this.authService.isLoggedIn()) {
      window.location.href = `/book/${trainId}`;
    } else {
      window.location.href = '/login';
    }
  }

  viewSeats(trainId: number) {
    // This could open a modal or navigate to a seat view page
    this.snackBar.open('Seat view feature coming soon!', 'Close', { duration: 2000 });
  }

  private formatDate(date: Date): string {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  }
}

