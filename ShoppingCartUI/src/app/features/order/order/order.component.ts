import { Component, OnInit } from '@angular/core';
import { Order } from '../models/order.model';
import { OrderService } from '../service/order.service';

 
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit{
  orders: Order[] = [];
 
  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadUserOrders();
    
  }
 
  loadUserOrders() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.orderService.getOrdersByUserId(userId).subscribe({
        next: (orders) => {
          this.orders = orders;
          
          
        },
        error: (error) => {
          console.error('Error loading orders', error);
        }
      });
    }
  }
}