import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email!: string;
  password!: string;
  errorMessage!: string;
  constructor(private authService: AuthService, private router: Router) { }
  register() {
    this.authService.register(this.email, this.password).subscribe(
      () => {
        this.authService.setIsLoggedIn(true)
        this.router.navigate(['/home']);
      },
      error => {
        this.errorMessage = error.error.message;
      }
    );
  }
}
