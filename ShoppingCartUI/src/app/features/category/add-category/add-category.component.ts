import { Component, OnDestroy, OnInit } from '@angular/core';
import { AddCategoryRequest } from '../models/add-category-request.model';
import { CategoryService } from '../services/category.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Category } from '../models/category.model'; 

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit, OnDestroy {
  model: AddCategoryRequest;
  private addCategorySubscription?: Subscription;
  existingCategories: Category[] = [];
  errorMessage: string = '';


  constructor(private categoryService: CategoryService, private router: Router) {
    this.model = { name: '' };
  }

  ngOnInit(): void {
    this.loadExistingCategories();
  }

  loadExistingCategories(): void {
    this.categoryService.getAllCategories().subscribe((categories: Category[]) => {
      this.existingCategories = categories;
    });
  }

  onFormSubmit(): void {
    if (this.existingCategories.some(cat => cat.name.toLowerCase() === this.model.name.toLowerCase())) {
      this.errorMessage = 'Category already exists.';
      return;
    }

    this.addCategorySubscription = this.categoryService.addCategory(this.model)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/categories');
        }
      });
  }

  ngOnDestroy(): void {
    this.addCategorySubscription?.unsubscribe();
  }
}


