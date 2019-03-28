import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { PasswordResetComponent } from './components/passwordReset/passwordReset.component';
import { RegisterComponent } from './components/register/register.component';
import { UserRequestsComponent } from './components/userrequests/userrequests.component';
import { OrderComponent } from './components/order/order.component';
import { StartComponent } from './components/start/start.component';
import { DisplayComposeComponent } from './components/displayCompose/displayCompose.component';
import { DisplayPartsComponent } from './components/displayParts/displayParts.component';
import { ArticlesComponent } from './components/articles/articles.component';

import { AuthGuard } from './services/auth.service';
import { UserComponent } from './components/user/user.component';
import { TreeViewComponent } from './components/tree-view/tree-view.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'passwordReset', component: PasswordResetComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'userRequests', component: UserRequestsComponent, canActivate: [AuthGuard] },
  { path: 'order', component: OrderComponent, canActivate: [AuthGuard] },
  { path: 'start', component: StartComponent, canActivate: [AuthGuard] },
  { path: 'displayCompose', component: DisplayComposeComponent, canActivate: [AuthGuard] },
  { path: 'displayParts', component: DisplayPartsComponent, canActivate: [AuthGuard] },
  { path: 'articles', component: ArticlesComponent, canActivate: [AuthGuard] },
  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'displayorders', component: TreeViewComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
