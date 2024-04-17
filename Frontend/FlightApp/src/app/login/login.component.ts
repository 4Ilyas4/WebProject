import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email!: string;
  password!: string;
  errorMessage!: string;

  constructor(private authService: ApiService, private router: Router) { }

  login() {
    this.authService.login(this.email, this.password).subscribe(
      () => {
        // Редирект на другую страницу после успешного входа
        this.authService.setIsLoggedIn(true);
        this.router.navigate(['/home']); 
      },
      error => {
        this.errorMessage = error.error.message;
      }
    );
  }
}
