import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { LoginResponse } from './login-response';
import { tap } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private apiUrl = 'http://localhost:8000'; 
  
    private loggedIn: boolean = false;
    
    constructor(private http: HttpClient,private apiService: ApiService) { }
  
    login(email: string, password: string): Observable<LoginResponse> {
      return this.http.post<LoginResponse>(`${this.apiUrl}/login/`, { email, password })
        .pipe(
          tap(response => {
            const accessToken = response.access;
            this.apiService.setAccessToken(accessToken); 
          })
        );
    }
  
    register(email: string, password: string): Observable<LoginResponse> {
      return this.http.post<LoginResponse>(`${this.apiUrl}/register/`, { email, password })
        .pipe(
          tap(response => {
            const accessToken = response.access; 
            this.apiService.setAccessToken(accessToken); 
          })
        );
    }
  
    
    logout() {
      this.apiService.clearAccessToken(); 
      this.loggedIn = false;
    }
  
    setIsLoggedIn(value: boolean) {
      this.loggedIn = value;
    }
  
    isLoggedIn(): boolean {
      return this.loggedIn;
    }

  }