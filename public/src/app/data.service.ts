import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {

  private userSource = new BehaviorSubject('');
  userCurrent = this.userSource.asObservable();

  constructor() { }

  changeUser(user: string) {
    this.userSource.next(user);
  };

}