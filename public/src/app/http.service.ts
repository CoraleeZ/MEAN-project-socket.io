import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  greeting = this._socket.fromEvent<string>('greeting');
  world = this._socket.fromEvent<any[]>('World');
  boxinfo =this._socket.fromEvent<any>('Boxinfo')
  display =this._socket.fromEvent<any>('Display')
  newplayer=this._socket.fromEvent<string>("Newplayer");
  worldnew =this._socket.fromEvent<any[]>("Worldnew");
  gamersposition=this._socket.fromEvent<string[]>("Move");
  


  constructor(private _socket: Socket) { }
  
  // sendMessage(msg:any){
  //   this._socket.emit('thankyou', msg); 
  // };

  // getMessage() {
  //   return this._socket
  //       .fromEvent("greeting");
  // }

  sendImNew(msg:any){
    this._socket.emit('ImNew', msg); 
  };


  sendPosition(msg:any){
    this._socket.emit('Position', msg); 
  };


  // sendReCreateWorld(msg:any){
  //   this._socket.emit('ReCreateWorld', msg); 
  // };

  sendCompareCount(msg:any){
    this._socket.emit('CompareCount',msg);
  };

  sendChangeWorld(msg:any){
    this._socket.emit('ChangeWorld',msg);
  };

  sendChangeScore(msg:any){
    this._socket.emit('ChangeScore',msg);
  }

  sendDisPokemonname(msg:any){
    this._socket.emit('DisPokemonname',msg);
  }

  sendChangeCount(msg:any){
    this._socket.emit('ChangeCount',msg);
  }





           
}
