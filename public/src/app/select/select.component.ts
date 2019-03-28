import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent implements OnInit {

  constructor(private _router: Router) { }

  play(character){
    this._router.navigate(['/game/', {pokemon: character}]);
  }

  ngOnInit() {
  }

}
