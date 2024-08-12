import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddCategoryRequest } from '../models/add-category-request.model';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

import { UpdateCategoryRequest } from '../models/update-category-request.model';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient, private cookieSerive:CookieService) { }

  
  getAllCategories(): Observable<Category[]>{
    return this.http.get<Category[]>(`${environment.apiBaseUrl}/api/ProductCategories`);
  }
  
  getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(`${environment.apiBaseUrl}/api/ProductCategories/${id}`);
  }
  
  addCategory(model:AddCategoryRequest): Observable<void>{
    return this.http.post<void>(`${environment.apiBaseUrl}/api/ProductCategories?addAuth=true`, model);
  }

  updateCategory(id: string, updateCategoryRequest: UpdateCategoryRequest): Observable<Category> {
    return this.http.put<Category>(`${environment.apiBaseUrl}/api/ProductCategories/${id}?addAuth=true`, updateCategoryRequest);
  }

  deleteCategory(id: string): Observable<Category> {
    return this.http.delete<Category>(`${environment.apiBaseUrl}/api/ProductCategories/${id}?addAuth=true`)
  }
}
