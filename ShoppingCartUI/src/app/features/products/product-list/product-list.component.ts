import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products$?:Observable<Product[]>;

  constructor(private productService : ProductsService) { 
  }
  ngOnInit(): void {
    // get all product from api
    this.products$ = this.productService.getAllProducts()
  }

}
