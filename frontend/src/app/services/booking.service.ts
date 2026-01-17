import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking, BookingCreate } from '../models/booking.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  bookTicket(booking: BookingCreate): Observable<Booking> {
    return this.http.post<Booking>(`${this.API_URL}/book`, booking);
  }

  getUserBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.API_URL}/bookings`);
  }

  cancelBooking(bookingId: number): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.API_URL}/cancel/${bookingId}`);
  }
}
