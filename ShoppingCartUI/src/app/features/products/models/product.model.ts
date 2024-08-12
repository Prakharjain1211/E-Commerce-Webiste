import { Category } from "../../category/models/category.model";

export interface Product{
    id : number;
    name : string;
    shortDescription : string;
    price : number;
    featuredImageUrl : string;
    categories: Category[];
}