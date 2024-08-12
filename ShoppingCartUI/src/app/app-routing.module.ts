import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryListComponent } from './features/category/category-list/category-list.component';
import { AddCategoryComponent } from './features/category/add-category/add-category.component';
import { EditCategoryComponent } from './features/category/edit-category/edit-category.component';
import { ProductListComponent } from './features/products/product-list/product-list.component';
import { AddProductComponent } from './features/products/add-product/add-product.component';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './features/auth/guards/auth.guard';
import { RegisterComponent } from './features/auth/register/register.component';
import { EditProductComponent } from './features/products/edit-product/edit-product.component';
import { HomeComponent } from './features/public/home/home.component';
import { ProductDetailsComponent } from './features/public/product-details/product-details.component';
import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { OrderComponent } from './features/order/order/order.component';
import { OrderDetailComponent } from './features/order/order-detail/order-detail.component';

const routes: Routes = [
  {
    path:'',
    component:HomeComponent,
  },
  { path: 'cart', component: CartComponent },
  {
    path: 'product/:id',
    component: ProductDetailsComponent,
  },
  {
    path: 'categories',
    component: CategoryListComponent,
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'admin/categories/add',
    component: AddCategoryComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin/categories/:id',
    component: EditCategoryComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin/products/:id',
    component: EditProductComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin/products',
    component: ProductListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin/products/add/addProduct',
    component: AddProductComponent,
    canActivate: [authGuard]
  },
  {path: 'checkout', component: CheckoutComponent },
  { path: 'orders', component: OrderComponent },
  { path: 'orders/:id', component: OrderDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
