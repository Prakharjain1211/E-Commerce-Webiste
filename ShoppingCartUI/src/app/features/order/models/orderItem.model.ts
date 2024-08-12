import { Product } from "../../products/models/product.model";

export interface OrderItem{
    productId:number;
    quantity:number;
    unitPrice:number;
    // product:Product;
    productName:string;
    productUrl:string;
}