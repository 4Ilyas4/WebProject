import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Ticket } from '../ticket';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css'
})
export class TicketsComponent implements OnInit {
  tickets: Ticket[] = [];

  authService! : AuthService
  constructor(private apiService: ApiService,
    authService : AuthService
  ) { this.authService = authService }

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.apiService.getTickets().subscribe(
      (tickets: Ticket[]) => {
        this.tickets = tickets;
      },
      error => {
        console.error('Error fetching tickets:', error);
      }
    );
  }
  logout() {
    this.authService.logout()
  }
  
}