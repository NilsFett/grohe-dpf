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

import { DpfContentDirective } from './components/directives/dpf-content.directive';
import { DpfOverflowWrapperDirective } from './components/directives/dpf-overflow-wrapper.directive';

import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatTableModule} from '@angular/material/table';
import {MatNativeDateModule, NativeDateAdapter, DateAdapter,  MatSortModule, MatPaginatorModule} from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule,MatCheckboxModule} from '@angular/material';
import {MatButtonModule} from '@angular/material/button';

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
import { UserComponent } from './components/user/user.component';
import { UserFilter } from './pipes/user/userFilter';
import { DpComponent } from './components/dp/dp.component';
import { TestComponent } from './components/test/test.component';

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
    DpfContentDirective,
    DpfOverflowWrapperDirective,
    DisplayPartsFilter,
    DisplaysFilter,
    ArticlesFilter,
    UserFilter,
    UserComponent,
    DpComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule, MatSortModule, MatPaginatorModule,MatFormFieldModule,MatSelectModule,MatInputModule,MatButtonModule,MatCheckboxModule
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
    UserFilter
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
