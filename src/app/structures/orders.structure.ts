import { Timestamp } from "firebase/firestore";

export type Order = {
    orderId?: string;
    dishes: any[];
    roomId: string;
    status: 'Completed' | 'Pending' | 'Cancelled';
    time: Timestamp;
}