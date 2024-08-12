import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Cart } from '../models/cart.model';
import { Product } from '../../products/models/product.model';
 
@Injectable({
  providedIn: 'root'
})
export class CartService {
 
  private apiUrl = 'http://localhost:5213/api/Cart';
  private localCartKey = 'localCart';
 
  constructor(private http: HttpClient) {}
 
  private getUserId(): string | null {
    const userId = localStorage.getItem('userId');
    return userId;
  }
 
  private getLocalCart(): Cart {
    const cartJson = localStorage.getItem(this.localCartKey);
        if (cartJson) {
          const cart = JSON.parse(cartJson) as Cart;
          return cart;
        }
        return { id: 0, userId: 0, cartItems: [] };
  }
 
  private saveLocalCart(cart: Cart) {
    localStorage.setItem(this.localCartKey, JSON.stringify(cart));
  }


  getCartItems(): Observable<Cart> {
    const userId = this.getUserId();
    if (userId) {
      return this.http.get<Cart>(`${this.apiUrl}/${userId}?addAuth=true`);
    } else {
      return of(this.getLocalCart());
    }
  }
 
  addToCart(product: Product, quantity: number): Observable<void> {
    // debugger;   
    const userId = this.getUserId();
    if (userId) {
      const body = { productId: product.id, quantity };
      return this.http.post<void>(`${this.apiUrl}/${userId}/items?addAuth=true`, body);
    } else {
      const cart = this.getLocalCart();
      const cartItem = cart.cartItems.find(item => item.productId === product.id);
      if (cartItem) {
        cartItem.quantity += quantity;
      } else {
        cart.cartItems.push({ productId: product.id, quantity, product });
      }
      this.saveLocalCart(cart);
      return of();
    }
  }
 
  incrementCartItem(productId: number): Observable<void> {
    const userId = this.getUserId();
    if (userId) {
      return this.http.post<void>(`${this.apiUrl}/${userId}/items/${productId}/increment?addAuth=true`, {});
    }  else {
      const cart = this.getLocalCart();
      const cartItem = cart.cartItems.find(item => item.productId === productId);
      if (cartItem) {
        cartItem.quantity++;
        this.saveLocalCart(cart);
      }
      return of();
    }
  }
 
  decrementCartItem(productId: number): Observable<void> {
    const userId = this.getUserId();
    if (userId) {
      return this.http.post<void>(`${this.apiUrl}/${userId}/items/${productId}/decrement?addAuth=true`, {});
    } else {
      const cart = this.getLocalCart();
      const cartItem = cart.cartItems.find(item => item.productId === productId);
      if (cartItem && cartItem.quantity > 1) {
        cartItem.quantity--;
        this.saveLocalCart(cart);
      } else {
        this.removeLocalCartItem(productId);
      }
      return of();
    }
  }
 
  removeFromCart(productId: number): Observable<void> {
    const userId = this.getUserId();
    if (userId) {
      return this.http.delete<void>(`${this.apiUrl}/${userId}/items/${productId}?addAuth=true`);
    } else {
      this.removeLocalCartItem(productId);
      return of();
    }
  }
 
  private removeLocalCartItem(productId: number) {
    const cart = this.getLocalCart();
    cart.cartItems = cart.cartItems.filter(item => item.productId !== productId);
    this.saveLocalCart(cart);
  }
 
  mergeLocalCartWithServerCart(): Observable<void> {
    const localCart = this.getLocalCart();
    const userId = this.getUserId();
    if (userId) {
      return this.http.post<void>(`${this.apiUrl}/${userId}/merge?addAuth=true`, localCart);
    } else {
      return of();
    }
  }
}
