import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { PasswordResetComponent } from './components/passwordReset/passwordReset.component';
import { RegisterComponent } from './components/register/register.component';
import { UserRequestsComponent } from './components/userrequests/userrequests.component';
//import { Order1Component } from './components/order1/order1.component';
import { Order2Component } from './components/order2/order2.component';
import { Order3Component } from './components/order3/order3.component';
import { OrdersComponent } from './components/orders/orders.component';
//import { StartComponent } from './components/start/start.component';
import { DisplayComposeComponent } from './components/displayCompose/displayCompose.component';
import { DisplayPartsComponent } from './components/displayParts/displayParts.component';
import { TopSignsComponent } from './components/topSigns/topSigns.component';
import { ArticlesComponent } from './components/articles/articles.component';
import { ProductsComponent } from './components/products/products.component';
import { MediasComponent } from './components/medias/medias.component';
import { AccountComponent } from './components/account/account.component';
import { PasswordComponent } from './components/password/password.component';

import { AuthGuard } from './services/auth.service';
import { UserComponent } from './components/user/user.component';
import { TreeViewComponent } from './components/tree-view/tree-view.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'passwordReset', component: PasswordResetComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'userRequests', component: UserRequestsComponent, canActivate: [AuthGuard] },
  //{ path: 'order1', component: Order1Component, canActivate: [AuthGuard] },
  { path: 'order2', component: Order2Component, canActivate: [AuthGuard] },
  { path: 'order3', component: Order3Component, canActivate: [AuthGuard] },
  { path: 'orders', component: OrdersComponent },
  //{ path: 'start', component: StartComponent, canActivate: [AuthGuard] },
  { path: 'displayCompose', component: DisplayComposeComponent, canActivate: [AuthGuard] },
  { path: 'displayParts', component: DisplayPartsComponent, canActivate: [AuthGuard] },
  { path: 'topSigns', component: TopSignsComponent, canActivate: [AuthGuard] },
  { path: 'articles', component: ArticlesComponent, canActivate: [AuthGuard] },
  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'displayorders', component: TreeViewComponent, canActivate: [AuthGuard] },
  { path: 'products', component: ProductsComponent, canActivate: [AuthGuard] },
  { path: 'products/:id', component: ProductsComponent, canActivate: [AuthGuard] },
  { path: 'medias', component: MediasComponent, canActivate: [AuthGuard] },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
  { path: 'changePassowrd', component: PasswordComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
