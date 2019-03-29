import { Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { HttpService } from './http.service'
import { GamepageComponent } from './gamepage/gamepage.component';
import { DataService } from './data.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Poke Smash';
  user:string;
  greeting:any;
  newplayer:Observable<string>;

  constructor(private _httpservice: HttpService, private _data: DataService) { }

  ngOnInit() {
    this._data.userCurrent.subscribe(user => this.user = user);
    this.newplayer=this._httpservice.newplayer;
  };

}
