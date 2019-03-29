import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent implements OnInit {

  constructor(private _router: Router) { }

  info ={
    username : '',
    character : ''
  };
  userForm:FormGroup;
  
  play(){
    console.log(this.userForm.get('username'));
    this._router.navigate(['/game/', {pokemon: this.userForm.get('character').value, user: this.userForm.get('username').value}]);
  };

  ngOnInit() {
    this.userForm = new FormGroup({
      'username': new FormControl(this.info.username, [
        Validators.required,
        Validators.minLength(2),
      ]),
      'character': new FormControl(this.info.character, Validators.required)
    });
    console.log(this.userForm);
  };

}

