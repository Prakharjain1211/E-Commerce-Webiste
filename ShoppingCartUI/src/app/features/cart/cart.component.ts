import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observer } from 'rxjs';
import { CartService } from './services/cart.service';
import { CartItem } from './models/CartItem.model';
import { Cart } from './models/cart.model';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  public get cartService(): CartService {
    return this._cartService;
  }
  public set cartService(value: CartService) {
    this._cartService = value;
  }
  model: Cart;
  cartItems: CartItem[] = [];

  constructor(private _cartService: CartService, private router: Router, private authService: AuthService) {
    this.model = {
      id: 0,
      userId: 0,
      cartItems: []
    };
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn() ) {
      alert("Please Login to access the cart");
      this.router.navigateByUrl('/login');
    }
     else
      this.loadCartItems();
  }


  loadCartItems() {
    const cartObserver: Observer<Cart> = {
      next: (data: Cart) => {
        this.model = data;
        this.cartItems = data.cartItems;
      },
      error: (error) => {
        console.error('Error loading cart items', error);
      },
      complete: () => {
        console.log('Cart items loaded');
      }
    };

    this.cartService.getCartItems().subscribe(cartObserver);
  }

  incrementCartItem(productId: number) {
    const incrementObserver: Observer<void> = {
      next: () => {
        this.loadCartItems();
      },
      error: (error) => {
        console.error('Error incrementing item in cart', error);
      },
      complete: () => {
        console.log('Item incremented in cart');
      }
    };

    this.cartService.incrementCartItem(productId).subscribe(incrementObserver);
  }

  decrementCartItem(productId: number) {
    const decrementObserver: Observer<void> = {
      next: () => {
        this.loadCartItems();
      },
      error: (error) => {
        console.error('Error decrementing item in cart', error);
      },
      complete: () => {
        console.log('Item decremented in cart');
      }
    };

    this.cartService.decrementCartItem(productId).subscribe(decrementObserver);
  }

  removeFromCart(productId: number) {
    const removeObserver: Observer<void> = {
      next: () => {
        this.loadCartItems();
      },
      error: (error) => {
        console.error('Error removing item from cart', error);
      },
      complete: () => {
        console.log('Item removed from cart');
      }
    };

    this.cartService.removeFromCart(productId).subscribe(removeObserver);
  }

  calculateTotalPrice(): number {
    return this.model.cartItems.reduce((total, item) => {
      return total + (item.product?.price * item.quantity);
    }, 0);
  }

  TotalPrice(): number {
    return this.model.cartItems.reduce((total, item) => {
      return 5 + total + (item.product?.price * item.quantity);
    }, 0);
  }

}
