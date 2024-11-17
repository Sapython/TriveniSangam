import { Timestamp } from 'firebase/firestore';

export type Room = {
  roomId?: string;
  number: string;
  images: string[];
  type: string;
  ratePerDay: number;
  description?: string;
  facilities?: string[];
  lastCleaned: Timestamp;
};
