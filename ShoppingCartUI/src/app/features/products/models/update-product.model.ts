export interface UpdateProduct{
    name : string;
    shortdescription : string;
    price : number;
    featuredImageUrl : string;
    categories: bigint[];
}