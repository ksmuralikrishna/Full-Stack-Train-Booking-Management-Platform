import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';

export interface Seat {
  number: number;
  isAvailable: boolean;
  isSelected: boolean;
}

@Component({
  selector: 'app-seat-map',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatChipsModule, MatCardModule],
  template: `
    <div class="seat-map-container">
      <div class="seat-map-header">
        <h3>Select Your Seats</h3>
        <div class="selected-seats" *ngIf="selectedSeats.length > 0">
          <span>Selected: </span>
          <mat-chip-set>
            <mat-chip *ngFor="let seat of selectedSeats" (removed)="removeSeat(seat)">
              Seat {{ seat }}
              <mat-icon matChipRemove>cancel</mat-icon>
            </mat-chip>
          </mat-chip-set>
        </div>
      </div>
      
      <div class="seat-map">
        <div class="train-layout">
          <div class="train-direction">
            <mat-icon>train</mat-icon>
            <span>Front of Train</span>
          </div>
          
          <div class="seats-grid">
            <div 
              class="seat" 
              *ngFor="let seat of seats" 
              [class.available]="seat.isAvailable"
              [class.selected]="seat.isSelected"
              [class.booked]="!seat.isAvailable"
              (click)="seat.isAvailable ? toggleSeat(seat) : null">
              <span class="seat-number">{{ seat.number }}</span>
              <mat-icon class="seat-icon" *ngIf="seat.isSelected">check</mat-icon>
              <mat-icon class="seat-icon" *ngIf="!seat.isAvailable">block</mat-icon>
            </div>
          </div>
          
          <div class="train-direction">
            <mat-icon>train</mat-icon>
            <span>Back of Train</span>
          </div>
        </div>
      </div>
      
      <div class="seat-legend">
        <div class="legend-item">
          <div class="legend-seat available"></div>
          <span>Available</span>
        </div>
        <div class="legend-item">
          <div class="legend-seat selected"></div>
          <span>Selected</span>
        </div>
        <div class="legend-item">
          <div class="legend-seat booked"></div>
          <span>Booked</span>
        </div>
      </div>
      
      <div class="seat-actions">
        <button 
          mat-raised-button 
          color="primary" 
          [disabled]="selectedSeats.length === 0"
          (click)="confirmSelection()">
          <mat-icon>check</mat-icon>
          Confirm Selection ({{ selectedSeats.length }} seats)
        </button>
        <button 
          mat-stroked-button 
          (click)="clearSelection()"
          [disabled]="selectedSeats.length === 0">
          <mat-icon>clear</mat-icon>
          Clear All
        </button>
      </div>
    </div>
  `,
  styles: [`
    .seat-map-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 24px;
    }
    
    .seat-map-header {
      margin-bottom: 24px;
      text-align: center;
    }
    
    .seat-map-header h3 {
      margin-bottom: 16px;
      color: #3f51b5;
    }
    
    .selected-seats {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    
    .seat-map {
      margin-bottom: 24px;
    }
    
    .train-layout {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    
    .train-direction {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      font-weight: 500;
    }
    
    .seats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      max-width: 400px;
      margin: 0 auto;
    }
    
    .seat {
      width: 60px;
      height: 60px;
      border: 2px solid #ddd;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      background-color: #f5f5f5;
    }
    
    .seat:hover:not(.booked) {
      transform: scale(1.05);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    
    .seat.available {
      background-color: #e8f5e8;
      border-color: #4caf50;
    }
    
    .seat.available:hover {
      background-color: #c8e6c9;
    }
    
    .seat.selected {
      background-color: #3f51b5;
      border-color: #3f51b5;
      color: white;
    }
    
    .seat.booked {
      background-color: #ffebee;
      border-color: #f44336;
      cursor: not-allowed;
      opacity: 0.6;
    }
    
    .seat-number {
      font-weight: 500;
      font-size: 14px;
    }
    
    .seat-icon {
      position: absolute;
      top: 2px;
      right: 2px;
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    
    .seat-legend {
      display: flex;
      justify-content: center;
      gap: 24px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .legend-seat {
      width: 20px;
      height: 20px;
      border: 2px solid #ddd;
      border-radius: 4px;
    }
    
    .legend-seat.available {
      background-color: #e8f5e8;
      border-color: #4caf50;
    }
    
    .legend-seat.selected {
      background-color: #3f51b5;
      border-color: #3f51b5;
    }
    
    .legend-seat.booked {
      background-color: #ffebee;
      border-color: #f44336;
    }
    
    .seat-actions {
      display: flex;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
    }
    
    @media (max-width: 768px) {
      .seats-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 6px;
      }
      
      .seat {
        width: 50px;
        height: 50px;
      }
      
      .seat-number {
        font-size: 12px;
      }
      
      .seat-legend {
        gap: 16px;
      }
      
      .seat-actions {
        flex-direction: column;
        align-items: center;
      }
    }
  `]
})
export class SeatMapComponent implements OnInit {
  @Input() totalSeats: number = 0;
  @Input() bookedSeats: number[] = [];
  @Input() maxSelections: number = 6;
  @Output() seatsSelected = new EventEmitter<number[]>();
  
  seats: Seat[] = [];
  selectedSeats: number[] = [];

  ngOnInit() {
    this.initializeSeats();
  }

  private initializeSeats() {
    this.seats = [];
    for (let i = 1; i <= this.totalSeats; i++) {
      this.seats.push({
        number: i,
        isAvailable: !this.bookedSeats.includes(i),
        isSelected: false
      });
    }
  }

  toggleSeat(seat: Seat) {
    if (!seat.isAvailable) return;
    
    if (seat.isSelected) {
      this.removeSeat(seat.number);
    } else {
      if (this.selectedSeats.length < this.maxSelections) {
        this.addSeat(seat.number);
      }
    }
  }

  addSeat(seatNumber: number) {
    if (!this.selectedSeats.includes(seatNumber) && this.selectedSeats.length < this.maxSelections) {
      this.selectedSeats.push(seatNumber);
      this.updateSeatSelection();
    }
  }

  removeSeat(seatNumber: number) {
    this.selectedSeats = this.selectedSeats.filter(seat => seat !== seatNumber);
    this.updateSeatSelection();
  }

  private updateSeatSelection() {
    this.seats.forEach(seat => {
      seat.isSelected = this.selectedSeats.includes(seat.number);
    });
  }

  clearSelection() {
    this.selectedSeats = [];
    this.updateSeatSelection();
  }

  confirmSelection() {
    if (this.selectedSeats.length > 0) {
      this.seatsSelected.emit([...this.selectedSeats]);
    }
  }
}
