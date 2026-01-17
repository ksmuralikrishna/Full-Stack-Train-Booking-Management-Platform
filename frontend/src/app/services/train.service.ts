import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Train, TrainSearchParams, SeatAvailability } from '../models/train.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrainService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTrains(searchParams?: TrainSearchParams): Observable<Train[]> {
    let params = new HttpParams();
    
    if (searchParams) {
      if (searchParams.source) params = params.set('source', searchParams.source);
      if (searchParams.destination) params = params.set('destination', searchParams.destination);
      if (searchParams.date) params = params.set('date', searchParams.date);
      if (searchParams.min_seats) params = params.set('min_seats', searchParams.min_seats.toString());
      if (searchParams.time_range) params = params.set('time_range', searchParams.time_range);
    }
    
    return this.http.get<Train[]>(`${this.API_URL}/trains`, { params });
  }

  getTrainSeats(trainId: number, date: string): Observable<SeatAvailability> {
    return this.http.get<SeatAvailability>(`${this.API_URL}/trains/${trainId}/seats`, {
      params: { date }
    });
  }
}
