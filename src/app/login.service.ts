import { Injectable } from '@angular/core';
import { User } from './ygopro.service';

@Injectable()
export class LoginService {

  user: User;
  token;

  sso(token: string) {
    this.token = token;
    let user = <User>{};
    for (let [key, value] of new URLSearchParams(Buffer.from(token, 'base64').toString())) {
      user[key] = value;
    }
    this.user = user;
    localStorage.setItem('login', token);
  }

}
