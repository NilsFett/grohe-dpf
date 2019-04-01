import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './components/login/login.component';
import { PasswordResetComponent } from './components/passwordReset/passwordReset.component';
import { RegisterComponent } from './components/register/register.component';
import { UserRequestsComponent } from './components/userrequests/userrequests.component';
import { StartComponent } from './components/start/start.component';
import { OrderComponent } from './components/order/order.component';
import { DisplayComposeComponent } from './components/displayCompose/displayCompose.component';
import { DisplayPartsComponent } from './components/displayParts/displayParts.component';
import { ArticlesComponent } from './components/articles/articles.component';
import { ProductsComponent } from './components/products/products.component';
import { OrdersComponent } from './components/orders/orders.component';
import { MediasComponent } from './components/medias/medias.component';


import { DpfContentDirective } from './components/directives/dpf-content.directive';
import { DpfOverflowWrapperDirective } from './components/directives/dpf-overflow-wrapper.directive';
import { DpfFormValidateAfterIfDirective } from './components/directives/dpf-form-validate-after-if.directive';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatNativeDateModule, NativeDateAdapter, DateAdapter,  MatSortModule, MatPaginatorModule, MatIconModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule,MatCheckboxModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatTreeModule } from '@angular/material/tree';
import { CdkTreeModule } from '@angular/cdk/tree';
//import { FileUploadModule } from 'ng2-file-upload';
import { FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';

import { UserService } from './services/user.service';
import { AuthGuard } from './services/auth.service';
import { CountryService } from './services/country.service';
import { ErrorService } from './services/error.service';
import { UiService } from './services/ui.service';
import { ConfigService } from './services/config.service';
import { DataService } from './services/data.service';

import { DisplayPartsFilter } from './pipes/displayParts/displayPartsFilter';
import { DisplaysFilter } from './pipes/displays/displaysFilter';
import { ArticlesFilter } from './pipes/articles/articlesFilter';
import { ProductsFilter } from './pipes/product/productFilter';

import { UserComponent } from './components/user/user.component';
import { UserFilter } from './pipes/user/userFilter';
import { TreeViewComponent } from './components/tree-view/tree-view.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PasswordResetComponent,
    UserRequestsComponent,
    RegisterComponent,
    StartComponent,
    OrderComponent,
    DisplayComposeComponent,
    DisplayPartsComponent,
    ArticlesComponent,
    ProductsComponent,
    OrdersComponent,
    DpfContentDirective,
    DpfOverflowWrapperDirective,
    DpfFormValidateAfterIfDirective,
    DisplayPartsFilter,
    DisplaysFilter,
    ArticlesFilter,
    UserFilter,
    UserComponent,
    TreeViewComponent,
    MediasComponent,
    FileSelectDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule, MatSortModule, MatPaginatorModule,MatFormFieldModule,MatSelectModule,MatInputModule,MatButtonModule,MatCheckboxModule
    ,MatTreeModule,MatIconModule
    ,CdkTreeModule
  ],
  providers: [
    UserService,
    AuthGuard,
    CountryService,
    ErrorService,
    UiService,
    ConfigService,
    DataService,
    DisplayPartsFilter,
    DisplaysFilter,
    ArticlesFilter,
    ProductsFilter,
    UserFilter
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
