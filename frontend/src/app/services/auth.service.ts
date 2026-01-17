import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, UserCreate, UserLogin, AuthResponse } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {
    // Check if user is logged in on service initialization
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, you might want to validate the token with the server
      // For now, we'll just check if it exists
      const userData = localStorage.getItem('user');
      if (userData) {
        this.currentUserSubject.next(JSON.parse(userData));
      }
    }
  }

  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  register(userData: UserCreate): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/register`, userData);
  }

  login(credentials: UserLogin): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.access_token);
          // Extract user info from token (in a real app, you'd decode the JWT)
          // For now, we'll store basic user info
          const user: User = {
            id: 1, // This would come from the token in a real app
            name: credentials.email.split('@')[0], // Temporary
            email: credentials.email
          };
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
