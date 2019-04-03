import { BrowserModule } from '@angular/platform-browser';
//this two line are for socket.io
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const config: SocketIoConfig = { url: 'http://18.191.217.211:8000', options: {} };
//
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GamepageComponent } from './gamepage/gamepage.component';
import { SelectComponent } from './select/select.component';
////
import { HttpClientModule } from '@angular/common/http';
import { HttpService } from './http.service';
import { DataService } from './data.service';

@NgModule({
  declarations: [
    AppComponent,
    GamepageComponent,
    SelectComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    //for socket.io
    SocketIoModule.forRoot(config)
    //
  ],
  providers: [HttpService, DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
