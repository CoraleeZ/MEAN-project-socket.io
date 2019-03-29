import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  // greeting = this._socket.fromEvent<string>('greeting');
  world = this._socket.fromEvent<any[]>('World');
  boxinfo =this._socket.fromEvent<any>('Boxinfo')
  display =this._socket.fromEvent<any>('Display')
  worldnew =this._socket.fromEvent<any[]>("Worldnew");
  newplayer=this._socket.fromEvent<string>("Newplayer");
  gamersposition=this._socket.fromEvent<string[]>("Move");
  topfive=this._socket.fromEvent<any[]>('TopFive');
  displaypokemonname=this._socket.fromEvent<string[]>('Dis_pokemonname');
  displayimgAndTitle=this._socket.fromEvent<any[]>('Dis_imgAndTitle')

  constructor(private _socket: Socket) { }
  
  sendImNew(msg:any){
    this._socket.emit('ImNew', msg); 
  };

  sendPosition(msg:any){
    this._socket.emit('Position', msg); 
  };

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

  sendReConnect(){
    this._socket.emit('recon')
  }
           
}
