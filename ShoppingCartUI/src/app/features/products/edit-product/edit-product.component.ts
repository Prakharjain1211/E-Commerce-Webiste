import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { CategoryService } from '../../category/services/category.service';
import { ProductsService } from '../services/products.service';
import { Category } from '../../category/models/category.model';
import { Product } from '../models/product.model';
import { UpdateProduct } from '../models/update-product.model';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit, OnDestroy {
  id: number = 0;
  model?: Product;
  categories$?: Observable<Category[]>;
  selectedCategories?: bigint[];

  routeSubscription?: Subscription;
  updateProductSubscription?: Subscription;
  getProductSubscription?: Subscription;
  deleteProductSubscription?: Subscription;

  constructor(private route: ActivatedRoute,
    private productService: ProductsService,
    private categoryService: CategoryService,
    private router: Router,
  ) { }


  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();


    this.routeSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        let idString = params.get('id');
        if (idString) {
          this.id = parseInt(idString, 10); 
        }

        // Get Product From API
        if (this.id) {
          this.getProductSubscription = this.productService.getProductById(this.id).subscribe({
            next: (response) => {
              this.model = response;
              this.selectedCategories = response.categories.map(x => x.id);
            }
          });
          ;
        }
      }
    });
  }

  onFormSubmit(): void {
    // Convert this model to Request Object
    if (this.model && this.id) {
      var updateProduct: UpdateProduct = {
        name: this.model.name,
        shortdescription: this.model.shortDescription,
        price: this.model.price,
        featuredImageUrl: this.model.featuredImageUrl,
        categories: this.selectedCategories ?? []
      };

      this.updateProductSubscription = this.productService.updateProduct(this.id, updateProduct)
        .subscribe({
          next: (response) => {
            this.router.navigateByUrl('/admin/products');
          }
        });
    }

  }

  onDelete(): void {
    if (this.id) {
      // call service and delete Product
      this.deleteProductSubscription = this.productService.deleteProduct(this.id)
        .subscribe({
          next: (response) => {
            this.router.navigateByUrl('/admin/products');
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.updateProductSubscription?.unsubscribe();
    this.getProductSubscription?.unsubscribe();
    this.deleteProductSubscription?.unsubscribe();
  }
}
