import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { Flight } from '../flight';

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './flights.component.html',
  styleUrl: './flights.component.css'
})
export class FlightsComponent implements OnInit {
  flights$!: Observable<Flight[]>;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadFlights();
  }

  loadFlights() {
    this.flights$ = this.apiService.getFlights();
  }
}
