import { Flight } from './flight';
import { User } from './user'

export interface Payment {
    payment_id: number;
    user: User; 
    flight: Flight; 
    price: number;
    payment_date: Date;
}
