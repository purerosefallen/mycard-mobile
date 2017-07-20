import { Injectable } from '@angular/core';
import { fromPairs } from 'lodash';
import { User } from './ygopro.service';

@Injectable()
export class LoginService {

  user: User;
  token: string;

  sso(token: string) {
    this.token = token;
    this.user = fromPairs(Array.from(new URLSearchParams(Buffer.from(token, 'base64').toString())));
    localStorage.setItem('login', token);
  }

}
