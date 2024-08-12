import { Component, OnInit } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Product } from '../../products/models/product.model';
import { ProductsService } from '../../products/services/products.service';
import { CartService } from '../../cart/services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products$?: Observable<Product[]>;

  constructor(private router: Router, private productService: ProductsService, private cartService: CartService, private route: ActivatedRoute, private authService: AuthService) {

  }

  ngOnInit(): void {
    this.products$ = this.route.queryParams.pipe(
      switchMap(params => {
        const category = params['category'];
        return category ? this.productService.getProductsByCategory(category) : this.productService.getAllProducts();
      })
    );
  }


  addToCart(product: Product): void {
    if (!this.authService.isLoggedIn()) {
      alert('Please log in to add products to the cart.');
      this.router.navigate(['/login']);
    }

    const quantity = 1; // Default quantity, can be changed as needed
    this.cartService.addToCart(product, quantity).subscribe({
      next: () => {
        alert('Product added to cart!');
      },
      error: (error) => {
        alert(`Error adding product to cart: ${error.message}`);
      }
    });
  }
}