import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from '../modules/products/components/products/products.component';
import { LoginComponent } from 'src/modules/auth/components/login/login.component';
import { SignupComponent } from 'src/modules/auth/components/signup/signup.component';
import { CartComponent } from './cart/cart.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { AuthGuard } from 'src/modules/auth/guards/auth-guard.service';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'auth/login',
    component: LoginComponent
  },
  {
    path: 'auth/register',
    component: SignupComponent
  },
  {
    path: 'products',
    loadChildren: () =>
      import('../wrappers/products.wrapper').then(
        (m) => m.ProductsWrapperModule
      ),
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'orders',
    component: MyOrdersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'about',
    component: AboutComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
