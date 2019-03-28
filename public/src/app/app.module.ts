import { BrowserModule } from '@angular/platform-browser';
//this two line are for socket.io
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const config: SocketIoConfig = { url: 'http://192.168.1.49:8000', options: {} };
//
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GamepageComponent } from './gamepage/gamepage.component';
import { SelectComponent } from './select/select.component';

@NgModule({
  declarations: [
    AppComponent,
    GamepageComponent,
    SelectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    //for socket.io
    SocketIoModule.forRoot(config)
    //
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
