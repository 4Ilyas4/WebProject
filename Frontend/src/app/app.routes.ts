import { Routes } from '@angular/router';
import { FlightDetailComponent } from './flight-detail/flight-detail.component';
import { FlightsComponent } from './flights/flights.component';
import { SuccessComponent } from './success/success.component';
import { TicketsComponent } from './tickets/tickets.component';
import { PaymentsComponent } from './payments/payments.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth-guard.service';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'flights', component: FlightsComponent, canActivate: [AuthGuard]  }, 
    { path: 'flights/:id', component: FlightDetailComponent, canActivate: [AuthGuard] }, 
    { path: 'success', component: SuccessComponent, canActivate: [AuthGuard]  },
    { path: 'tickets', component: TicketsComponent, canActivate: [AuthGuard]  }, 
    { path: 'payments', component: PaymentsComponent, canActivate: [AuthGuard]  },
    { path: 'success', component: SuccessComponent, canActivate: [AuthGuard] },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: '', component: HomeComponent, pathMatch: 'full'}
];
