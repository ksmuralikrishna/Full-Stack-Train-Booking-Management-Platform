import { Train } from './train.model';

export interface Booking {
  id: number;
  user_id: number;
  train_id: number;
  seat_numbers: number[];
  date: string;
  booking_time: string;
  train?: Train;
}

export interface BookingCreate {
  train_id: number;
  seat_numbers: number[];
  date: string;
}

