import { Product } from "../../products/models/product.model";

export interface CartItem{
    productId: number;
    quantity:number;
    product: Product;
}