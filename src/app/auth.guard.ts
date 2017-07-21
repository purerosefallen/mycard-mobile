import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, RouterStateSnapshot } from '@angular/router';
import { LoginService } from './login.service';

@Injectable()
export class AuthGuard implements CanActivateChild {
  constructor(private login: LoginService) {
  }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (this.login.user) {
      return true;
    }

    const token = state.root.queryParamMap.get('sso') || new URL(location.href).searchParams.get('sso') || localStorage.getItem('login');

    if (token) {
      this.login.callback(token);
      return true;
    } else {
      this.login.login();
      return false;
    }

  }
}
