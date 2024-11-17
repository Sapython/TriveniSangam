import { Timestamp } from 'firebase/firestore';

export type Booking = {
  bookingId?: string;
  checkInTime: Timestamp;
  checkOutTime: Timestamp | null;
  roomId: string;
  guests: string[];
  paymentStatus: 'Pending' | 'Done';
  roomPrice: number;
};

export type Guest = {
  guestId?: string;
  name: string;
  dob: Timestamp;
  phoneNumber?: string;
  email?: string;
  address?: string;
  panNumber?: string;
  panImage?: string;
  aadhaarNumber?: string;
  aadhaarImage?: string;
};
