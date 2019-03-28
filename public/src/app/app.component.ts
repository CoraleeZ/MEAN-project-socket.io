import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from './http.service'
import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'public';
  greeting:any;
  newplayer:Observable<string>;

  constructor(private _httpservice: HttpService) { }

  ngOnInit() {
    // this.newplayer=this._httpservice.newplayer;
    // this._httpservice.getMessage()
    // .subscribe(data => {
    //   console.log(data);
    //   this.greeting=data['msg'];
    //   let msg={ msg: 'Thank you for connecting me! -Client' }
    //   this._httpservice.sendMessage(msg);
    // });
  }

}
