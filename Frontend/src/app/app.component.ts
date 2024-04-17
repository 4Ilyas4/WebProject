import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  authService : AuthService

  constructor(authService : AuthService) {
    this.authService = authService
  }
  
  logout() {
    this.authService.logout()
  }
  title = 'Frontend';
}
