import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Payment } from '../payment';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent implements OnInit {
  payments: Payment[] = [];
  errorMessage: string = '';
  authService! : AuthService

  constructor(
    private apiService: ApiService,
    authService : AuthService
  ) {
    this.authService = authService 
  }
  
  ngOnInit(): void {
    this.getPayments();
  }
  
  logout() {
    this.authService.logout()
  }
  
  getPayments(): void {
    this.apiService.getPayments().subscribe(
      (payments: Payment[]) => {
        this.payments = payments;
      },
      (error) => {
        this.errorMessage = error.message;
      }
    );
  }
}