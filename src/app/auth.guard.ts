import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { LoginService } from './login.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private login: LoginService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token = state.root.queryParamMap.get('sso') || new URL(location.href).searchParams.get('sso') || localStorage.getItem('login');
    console.log(token)
    if (!token) {
      alert('login required');
      return false;
    }
    this.login.sso(token);
    return true;
  }
}
