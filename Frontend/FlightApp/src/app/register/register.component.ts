import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  constructor(private authService: ApiService, private router: Router) { }
  register() {
    this.authService.register(this.email, this.password).subscribe(
      () => {
        this.authService.setIsLoggedIn(true);
        this.router.navigate(['/home']);
      },
      error => {
        this.errorMessage = error.error.message;
      }
    );
  }
}
