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
import { DisplayComposeComponent } from './components/displayCompose/displayCompose.component';
import { DisplayPartsComponent } from './components/displayParts/displayParts.component';
import { ArticlesComponent } from './components/articles/articles.component';
import { ProductsComponent } from './components/products/products.component';
/*import { Order1Component } from './components/order1/order1.component';*/
import { Order2Component } from './components/order2/order2.component';
import { Order3Component } from './components/order3/order3.component';
import { MediasComponent } from './components/medias/medias.component';
import { TopSignsComponent } from './components/topSigns/topSigns.component';
import { AccountComponent } from './components/account/account.component';
import { PasswordComponent } from './components/password/password.component';
import { OrdersComponent } from './components/orders/orders.component';

import { DpfContentDirective } from './components/directives/dpf-content.directive';
import { DpfOverflowWrapperDirective } from './components/directives/dpf-overflow-wrapper.directive';
import { DpfFormValidateAfterIfDirective } from './components/directives/dpf-form-validate-after-if.directive';
import { DpfSyncWidth } from './components/directives/dpf-sync-width.directive';
import { DpfSyncWidthSource } from './components/directives/dpf-sync-width-source.directive';
import { UserComponent } from './components/user/user.component';
import { TreeViewComponent } from './components/tree-view/tree-view.component';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatNativeDateModule, NativeDateAdapter, DateAdapter,  MatSortModule, MatPaginatorModule, MatIconModule, MAT_DATE_FORMATS } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule,MatCheckboxModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatTreeModule } from '@angular/material/tree';
import { CdkTreeModule } from '@angular/cdk/tree';
import { FileUploadModule } from 'ng2-file-upload';
//import { FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';

import { UserService } from './services/user.service';
import { AuthGuard } from './services/auth.service';
import { CountryService } from './services/country.service';
import { ErrorService } from './services/error.service';
import { UiService } from './services/ui.service';
import { ConfigService } from './services/config.service';
import { DataService } from './services/data.service';
import { OrderService } from './services/order.service';

import { DisplayPartsFilter } from './pipes/displayParts/displayPartsFilter';
import { DisplaysFilter } from './pipes/displays/displaysFilter';
import { ArticlesFilter } from './pipes/articles/articlesFilter';
import { ProductsFilter } from './pipes/product/productFilter';
import { TopSignsFilter } from './pipes/topSigns/topSignsFilter';
import { UserFilter } from './pipes/user/userFilter';
import { OrderFilter } from './pipes/order/orderFilter';

const MY_DATE_FORMATS = {
   parse: {
       dateInput: {month: 'numeric', year: 'numeric', day: 'numeric'}
   },
   display: {
       // dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
       dateInput: 'input',
       monthYearLabel: {year: 'numeric', month: 'short'},
       dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
       monthYearA11yLabel: {year: 'numeric', month: 'long'},
   }
};

export class MyDateAdapter extends NativeDateAdapter {
   format(date: Date, displayFormat: Object): string {
       if (displayFormat == "input") {
           let day = date.getDate();
           let month = date.getMonth() + 1;
           let year = date.getFullYear();
           return day + '.' + month + '.' + year;
       } else {
           return date.toDateString();
       }
   }

}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PasswordResetComponent,
    UserRequestsComponent,
    RegisterComponent,
    PasswordComponent,
    StartComponent,
    Order2Component,
    Order3Component,
    OrdersComponent,
    DisplayComposeComponent,
    DisplayPartsComponent,
    ArticlesComponent,
    TopSignsComponent,
    ProductsComponent,
    AccountComponent,
    DpfContentDirective,
    DpfOverflowWrapperDirective,
    DpfFormValidateAfterIfDirective,
    DpfSyncWidth,
    DpfSyncWidthSource,
    DisplayPartsFilter,
    DisplaysFilter,
    ArticlesFilter,
    ProductsFilter,
    TopSignsFilter,
    UserFilter,
    OrderFilter,
    UserComponent,
    TreeViewComponent,
    MediasComponent/*,
    FileSelectDirective*/
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule, MatSortModule, MatPaginatorModule,MatFormFieldModule,
    MatSelectModule,MatInputModule,MatButtonModule,MatCheckboxModule
    ,MatTreeModule,MatIconModule, MatDatepickerModule, MatNativeDateModule
    ,CdkTreeModule,FileUploadModule
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
    ProductsFilter,
    UserFilter,
    OrderFilter,
    TopSignsFilter,
    OrderService,
    {provide: DateAdapter, useClass: MyDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
