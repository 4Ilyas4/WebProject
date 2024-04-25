import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { Flight } from '../flight';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, FormsModule ],
  templateUrl: './flights.component.html',
  styleUrl: './flights.component.css'
})
export class FlightsComponent implements OnInit {
    flights$!: Flight[];
    maxPrice: string = "0";
    authService! : AuthService
    departureAirport: string = "";
    departureTime: string = "";

    constructor(
      private apiService: ApiService,
      private router: Router,
      authService : AuthService,
    ) { 
      this.authService = authService 
    }
  
    ngOnInit(): void {
      this.loadFlights();
    }
  
    logout() {
      this.authService.logout()
    }

    loadFlights(): void {
      this.apiService.getFlights().subscribe(
        (flights: Flight[]) => {
          this.flights$ = flights;
        },
        (error) => {
          console.error('Error fetching flights:', error);
        }
      );
    }

    searchFlights(maxPrice : string, departureAirport: string, departureTime: string ): void {
      const price = parseFloat(maxPrice);
      const airport = departureAirport;
      const time = departureTime;

      this.apiService.searchFlights(price, airport, time).subscribe(
        (flights: Flight[]) => {
          this.flights$ = flights;
        },
        (error) => {
          console.error('Error fetching flights:', error);
        }
      );
    }

    goBack(): void {
      this.router.navigate(['/']); 
    }
}
