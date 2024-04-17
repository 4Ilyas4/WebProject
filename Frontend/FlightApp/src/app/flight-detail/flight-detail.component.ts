import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Payment } from '../payment';
import { Flight } from '../flight';

@Component({
  selector: 'app-flight-detail',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './flight-detail.component.html',
  styleUrl: './flight-detail.component.css'
})
export class FlightDetailComponent implements OnInit {
  flight$!: Observable<Flight>;
  flightId!: number;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router 
  ) { }

  ngOnInit(): void {
    this.flight$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          this.flightId = +id;
          return this.apiService.getFlightDetail(this.flightId);
        } else {
          throw new Error('Flight ID not provided');
        }
      })
    );
  }
  
  buyTicket(): void {
    if(this.flightId){
      this.apiService.createPayment(this.flightId).subscribe(
        () => {

          this.router.navigate(['/success']);
        },
        (error) => {
          
          console.error('Error occurred during payment:', error);
        }
      );
    }
  }
}