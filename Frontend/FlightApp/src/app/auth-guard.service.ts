import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard{
  constructor(private authService: ApiService, private router: Router) {}
  canActivate(): boolean {
    if (this.authService.getIsLoggedIn()) {
      return true; 
    } else {
      this.router.navigate(['/login']); 
      return false;
    }
  }
}
