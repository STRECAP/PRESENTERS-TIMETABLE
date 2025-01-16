export interface Presenter {
  name: string;
  phone: string;
  level: 1 | 2;
}

export interface Schedule {
  [day: string]: {
    [timeSlot: string]: string[];
  }
}

