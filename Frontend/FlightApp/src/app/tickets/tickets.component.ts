import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Ticket } from '../ticket';
import { AuthGuard } from '../auth-guard.service';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css'
})
export class TicketsComponent implements OnInit {
  tickets: Ticket[] = [];

  constructor(private apiService: ApiService, private auth: AuthGuard) { }

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
}