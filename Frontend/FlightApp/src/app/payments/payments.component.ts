import { Component, OnInit } from '@angular/core';
import { Payment } from '../payment';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

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

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getPayments();
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