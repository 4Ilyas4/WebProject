import { User } from './user'
import { Flight } from './flight'
import { Payment } from './payment';

export interface Ticket {
    ticket_id: number;
    user: User; 
    flight: Flight; 
    price: number;
    payment: Payment; 
}
