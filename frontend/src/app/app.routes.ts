import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TrainListComponent } from './components/train-list/train-list.component';
import { BookingComponent } from './components/booking/booking.component';
import { MyBookingsComponent } from './components/my-bookings/my-bookings.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'trains', component: TrainListComponent },
  { path: 'book/:id', component: BookingComponent, canActivate: [authGuard] },
  { path: 'bookings', component: MyBookingsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];