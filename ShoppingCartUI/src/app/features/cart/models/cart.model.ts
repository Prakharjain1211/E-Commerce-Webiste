import { CartItem } from "./CartItem.model";

export interface Cart{
    id: number;
    userId:number;
    cartItems:CartItem[];


}