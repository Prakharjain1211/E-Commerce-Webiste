import { OrderItem } from "./orderItem.model";

export interface Order{
    id:number;
    userId: string;
    orderDate:Date;
    totalAmount: number;
    orderItems: OrderItem[];
}