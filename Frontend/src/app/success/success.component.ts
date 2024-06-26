import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent {
  authService! : AuthService

  constructor(
    private router: Router,
    authService : AuthService 
  ) { 
    this.authService = authService
  }

  logout() {
    this.authService.logout()
  }

  goBack(): void {
    this.router.navigate(['/']); 
  }
}
