import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { Flight } from '../flight';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './flights.component.html',
  styleUrl: './flights.component.css'
})
export class FlightsComponent implements OnInit {
    flights$!: Observable<Flight[]>;
  
    constructor(
      private apiService: ApiService
      ,authService : AuthService
    ) { this.authService = authService }
    authService! : AuthService
  
    ngOnInit(): void {
      this.loadFlights();
    }
  
    logout() {
      this.authService.logout()
    }

    loadFlights() {
      this.flights$ = this.apiService.getFlights();
    }
    
}
