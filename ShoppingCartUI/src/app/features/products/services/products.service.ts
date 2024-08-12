import { Injectable } from '@angular/core';
import { AddProduct } from '../models/add-product.model';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UpdateProduct } from '../models/update-product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http:HttpClient) { }

  createProduct(data: AddProduct): Observable<Product>{
   return  this.http.post<Product>(`${environment.apiBaseUrl}/api/Products?addAuth=true`,data);
  }

  getAllProducts():Observable<Product[]>{
    return this.http.get<Product[]>(`${environment.apiBaseUrl}/api/Products`);
  }

  getProductById(id:number):Observable<Product>{
    return this.http.get<Product>(`${environment.apiBaseUrl}/api/Products/${id}`);
  } 
  
  updateProduct(id:number, updatedProduct:UpdateProduct):Observable<Product>{
      return this.http.put<Product>(`${environment.apiBaseUrl}/api/Products/${id}?addAuth=true`,updatedProduct);
  }

  deleteProduct(id:number):Observable<Product>{
    return this.http.delete<Product>(`${environment.apiBaseUrl}/api/Products/${id}?addAuth=true`);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiBaseUrl}/api/Products/searchByCategory/${category}`);
  }  
}
