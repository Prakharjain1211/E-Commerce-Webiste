import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Order } from "../models/order.model";

 
@Injectable({
  providedIn: 'root'
})
export class OrderService {
 
  private apiUrl = 'http://localhost:5213/api/Order';
 
  constructor(private http: HttpClient) {}
 
  checkout(userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${userId}`, {});
  }
 
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }
 
  getOrdersByUserId(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/user/${userId}`);
  }
 
  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }
}