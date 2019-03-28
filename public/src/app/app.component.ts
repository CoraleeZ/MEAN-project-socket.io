import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { HttpService } from './http.service'
import { GamepageComponent } from './gamepage/gamepage.component';
import { DataService } from './data.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild(GamepageComponent) gamepage;

  title = 'Poke Smash';
  user;
  greeting:any;

  constructor(private _httpservice: HttpService, private _data: DataService) { }

  ngOnInit() {
    this._data.userCurrent.subscribe(user => this.user = user)

    // this._httpservice.getMessage()
    // .subscribe(data => {
    //   console.log(data);
    //   this.greeting=data['msg'];
    //   let msg={ msg: 'Thank you for connecting me! -Client' }
    //   this._httpservice.sendMessage(msg);
    // });
  }

  // ngAfterViewInit() {
  //   this.user = this.gamepage.pokemon.user
  //   console.log(this.gamepage);
  // }

}
