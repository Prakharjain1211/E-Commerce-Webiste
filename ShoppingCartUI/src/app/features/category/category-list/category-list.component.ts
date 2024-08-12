import { Component, OnInit } from '@angular/core';
import { Category } from '../models/category.model';
import { CategoryService } from '../services/category.service';
import { Observable } from 'rxjs';
import { User } from '../../auth/models/user.model';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  categories$?: Observable<Category[]>;

  user?: User;

  constructor(private categoryService: CategoryService, private authService:AuthService) {
    
  }
  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();

    // this.authService.user()
    // .subscribe({
    //   next: (response) => {
    //     this.user = response;
        
    //   }
    // });

    this.user = this.authService.getUser();
    
  }

}
