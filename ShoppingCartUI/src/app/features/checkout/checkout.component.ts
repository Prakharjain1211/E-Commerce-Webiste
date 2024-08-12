import { Component, OnInit } from '@angular/core';
import { Cart } from '../cart/models/cart.model';
import { CartService } from '../cart/services/cart.service';
import { CartItem } from '../cart/models/CartItem.model';
import { OrderService } from '../order/service/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})


export class CheckoutComponent implements OnInit {
  model: Cart;


  constructor(private cartService: CartService, private orderService:OrderService,private router:Router) {
    this.model = {
      id: 0,
      userId: 0,
      cartItems: []
    };
  }

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.cartService.getCartItems().subscribe(cart =>{
      this.model = cart;
    })
  }


  placeOrder():void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.orderService.checkout(userId).subscribe({
        next: () => {
          alert('Order placed successfully!');
          this.router.navigate(['/orders']); // Navigate to orders page or any other page as needed
        },
        error: (error) => {
          console.error('Error placing order', error);
          alert(`Error placing order: ${error.message}`);
        }
      });
    } else {
      alert(`User Not Logged in`);
      this.router.navigate(['/login']);
    }
  }

  calculateTotalPrice(): number {
    return this.model.cartItems.reduce((total, item) => {
      return 5+ total + (item.product?.price * item.quantity);
    }, 0);
  }
}
