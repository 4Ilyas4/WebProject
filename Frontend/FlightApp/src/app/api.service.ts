import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket } from './ticket';
import { Payment } from './payment';
import { Flight } from './flight';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class ApiService { // с начала реализую все для пользователя добавив данные вручную потом админа
  private baseUrl = 'http://localhost:8000'; 

  isLoggedIn!: boolean;

  constructor(private http: HttpClient) { }

  setIsLoggedIn(value: boolean) {
    this.isLoggedIn = value;
  }

  getIsLoggedIn(): boolean {
    return this.isLoggedIn;
  }

  register(email: string, password: string) {
    return this.http.post(`${this.baseUrl}/register/`, { email, password , withCredentials: true });
  }

  login(email: string, password: string) {
    return this.http.post(`${this.baseUrl}/login/`, { email, password , withCredentials: true });
  }

  getFlights(): Observable<Flight[]> {
    return this.http.get<Flight[]>(`${this.baseUrl}/flights/`);
  }

  getFlightDetail(id: number): Observable<any> {
    return this.http.get<Flight>(`${this.baseUrl}/flights/${id}/`);
  }

  getTickets(): Observable<Ticket[]> { 
    return this.http.get<Ticket[]>(`${this.baseUrl}/tickets/`, { withCredentials: true });
  }

  getTicketByTicketID(id: number): Observable<Ticket> { //
    return this.http.get<Ticket>(`${this.baseUrl}/ticket/${id}/`, { withCredentials: true });
  }

  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.baseUrl}/payments`, { withCredentials: true });
  }

  createPayment(flightId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/payments/create/`, { withCredentials: true ,flight_id: flightId });
  }

  getUserDetail(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}/`, { withCredentials: true });
  }
}
