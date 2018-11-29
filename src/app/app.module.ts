import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './components/login/login.component';
import { OrderComponent } from './components/order/order.component';
import { DisplayComposeComponent } from './components/displayCompose/displayCompose.component';

import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatTableModule} from '@angular/material/table';
import {MatNativeDateModule, NativeDateAdapter, DateAdapter,  MatSortModule, MatPaginatorModule} from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule,MatCheckboxModule} from '@angular/material';
import {MatButtonModule} from '@angular/material/button';

import { UserService } from './services/user.service';
import { UiService } from './services/ui.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    OrderComponent,
    DisplayComposeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatTableModule, MatSortModule, MatPaginatorModule,MatFormFieldModule,MatSelectModule,MatInputModule,MatButtonModule,MatCheckboxModule
  ],
  providers: [
    UserService,
    UiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
