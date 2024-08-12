import { Component, Input } from '@angular/core';
import { Order } from '../models/order.model';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../service/order.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent {
  @Input() order: Order | undefined;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadOrderDetails();
  }

  loadOrderDetails() {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.orderService.getOrderById(+orderId).subscribe({
        next: (order) => {
          this.order = order;
          console.log(order.orderItems[0].productUrl);
          
        },
        error: (error) => {
          console.error('Error loading order details', error);
        }
      });
    }
  }
}
