import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Flight } from './flight';
import { Ticket } from './ticket';
import { Payment } from './payment';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8000';

  private accessToken: string | null = null;

  constructor(private http: HttpClient) { }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  clearAccessToken() {
    this.accessToken = null;
  }

  getFlights(): Observable<Flight[]> {
    if (!this.accessToken) {
      throw new Error('Access token not found');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.accessToken}`);
    return this.http.get<Flight[]>(`${this.baseUrl}/flights/`, { headers });
  }

  searchFlights(maxPrice: number): Observable<Flight[]> {
    if (!this.accessToken) {
      throw new Error('Access token not found');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.accessToken}`);
    const params = new HttpParams().set('max_price', maxPrice.toString());
    return this.http.get<Flight[]>(`${this.baseUrl}/flights/search/`, { params, headers });
  }
  
  getFlightDetail(id: number): Observable<any> {
    if (!this.accessToken) {
      throw new Error('Access token not found');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.accessToken}`);
    return this.http.get<Flight>(`${this.baseUrl}/flights/${id}/`, { headers });
  }

  getTickets(): Observable<Ticket[]> { 
    if (!this.accessToken) {
      throw new Error('Access token not found');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.accessToken}`);
    return this.http.get<Ticket[]>(`${this.baseUrl}/tickets/`, { headers });
  }

  getTicketByTicketID(id: number): Observable<Ticket> { 
    if (!this.accessToken) {
      throw new Error('Access token not found');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.accessToken}`);
    return this.http.get<Ticket>(`${this.baseUrl}/ticket/${id}/`, { headers });
  }

  getPayments(): Observable<Payment[]> {
    if (!this.accessToken) {
      throw new Error('Access token not found');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.accessToken}`);
    return this.http.get<Payment[]>(`${this.baseUrl}/payments`, { headers });
  }

  createPayment(flightId: number): Observable<any> {
    if (!this.accessToken) {
      throw new Error('Access token not found');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.accessToken}`);
    return this.http.post(`${this.baseUrl}/payments/create/${flightId}`, null, { headers });
  }
  
  getUserDetail(id: number): Observable<User> {
    if (!this.accessToken) {
      throw new Error('Access token not found');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.accessToken}`);
    return this.http.get<User>(`${this.baseUrl}/users/${id}`, { headers });
  }
}
