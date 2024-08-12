import { Component, OnDestroy, OnInit } from '@angular/core';
import { AddProduct } from '../models/add-product.model';
import { ProductsService } from '../services/products.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../category/services/category.service';
import { Observable, Subscription } from 'rxjs';
import { Category } from '../../category/models/category.model';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  model : AddProduct;
  categories$?: Observable<Category[]>;
  
  constructor(private productService: ProductsService, private router:Router, private categoryService:CategoryService) {
    this.model = {
      name : '',
      shortdescription :'',
      price: 0 ,
      featuredImageUrl:'',
      categories:[]
    }
  }
  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();
  }

  onFormSubmit():void{
    console.log(this.model);
    
    this.productService.createProduct(this.model)
    .subscribe({
      next:(response) =>{
        this.router.navigateByUrl('/admin/products');
      }
    });
    
  }
}
 