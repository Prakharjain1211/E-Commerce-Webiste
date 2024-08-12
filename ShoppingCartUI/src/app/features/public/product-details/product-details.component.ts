import { Component, OnInit } from '@angular/core';
import { Product } from '../../products/models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../products/services/products.service';
import { Observable } from 'rxjs';
import { CartService } from '../../cart/services/cart.service';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  url: number =0;
  product$?: Observable<Product>;

  constructor(private route: ActivatedRoute,
    private productService: ProductsService,private cartService: CartService, private authService: AuthService,private router: Router) {

  }
  ngOnInit(): void {
    this.route.paramMap
      .subscribe({
        next: (params) => {
          let idString = params.get('id');
        if (idString) {
          this.url = parseInt(idString, 10); // Convert string to number
        }
        }
      });

    // Fetch blog details by url
    if (this.url) {
      this.product$ = this.productService.getProductById(this.url);
    }
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
