import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpService} from './service/http.service'
import {FormsModule,ReactiveFormsModule} from '@angular/forms'
import {HttpClientModule} from "@angular/common/http";


import { EditComponent } from './components/edit/edit.component';
import { ListComponent } from './components/list/list.component';
import { InfoComponent } from './components/info/info.component';
import { EditoldComponent } from './components/editold/editold.component';
import { HeadComponent } from './components/head/head.component'

@NgModule({
  declarations: [
    AppComponent,
    EditComponent,
    ListComponent,
    InfoComponent,
    EditoldComponent,
    HeadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
