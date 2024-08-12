import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { CategoryListComponent } from './features/category/category-list/category-list.component';
import { AddCategoryComponent } from './features/category/add-category/add-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { EditCategoryComponent } from './features/category/edit-category/edit-category.component';
import { ProductListComponent } from './features/products/product-list/product-list.component';
import { AddProductComponent } from './features/products/add-product/add-product.component';
import { LoginComponent } from './features/auth/login/login.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { RegisterComponent } from './features/auth/register/register.component';
import { EditProductComponent } from './features/products/edit-product/edit-product.component';
import { HomeComponent } from './features/public/home/home.component';
import { ProductDetailsComponent } from './features/public/product-details/product-details.component';
import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { OrderComponent } from './features/order/order/order.component';
import { OrderDetailComponent } from './features/order/order-detail/order-detail.component';
import { CurrencyPipe } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CategoryListComponent,
    AddCategoryComponent,
    EditCategoryComponent,
    ProductListComponent,
    AddProductComponent,
    LoginComponent,
    RegisterComponent,
    EditProductComponent,
    HomeComponent,
    ProductDetailsComponent,
    CartComponent,
    CheckoutComponent,
    OrderComponent,
    OrderDetailComponent,


  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
