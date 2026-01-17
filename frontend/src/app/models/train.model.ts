export interface Train {
  id: number;
  name: string;
  source: string;
  destination: string;
  time: string;
  total_seats: number;
  available_seats: number;
  booked_seats: number[];
}

export interface TrainSearchParams {
  source?: string;
  destination?: string;
  date?: string;
  min_seats?: number;
  time_range?: string;
}

export interface SeatAvailability {
  train_id: number;
  date: string;
  total_seats: number;
  available_seats: number[];
  booked_seats: number[];
  available_count: number;
}

