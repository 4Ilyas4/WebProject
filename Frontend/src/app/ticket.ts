import { Flight } from "./flight";
import { Payment } from "./payment";
import { User } from "./user";

export interface Ticket {
    ticket_id: number;
    user: User; 
    flight: Flight; 
    price: number;
    payment: Payment; 
}
