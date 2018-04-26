import { Component, HostBinding } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Http, Jsonp } from '@angular/http';
import { environment } from '../../environments/environment';
import { LoginService } from '../login.service';
import { routerTransition2 } from '../router.animations';
import { StorageService } from '../storage.service';
import { YGOProService } from '../ygopro.service';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';





@Component({
  selector: 'app-lobby',
  templateUrl: 'lobby.component.html',
  styleUrls: ['lobby.component.css'],
  animations: [routerTransition2]
})
export class LobbyComponent {

  @HostBinding('@routerTransition2')
  animation: '';

  version = environment.version;
  build: BuildConfig;

  searchCtrl = new FormControl();
  suggestion = this.searchCtrl.valueChanges.filter(name => name).mergeMap(name => this.jsonp.get('http://www.ourocg.cn/Suggest.aspx', {
    params: {callback: 'JSONP_CALLBACK', key: name}
  }).map(response => response.json().result));

  key: string;

  arena_url: string;

  constructor(public login: LoginService,
              public ygopro: YGOProService,
              private http: Http,
              private jsonp: Jsonp,
              public storage: StorageService) {

    const arena_url = new URL('https://mycard.moe/ygopro/arena');
    arena_url.searchParams.set('sso', login.token);
    this.arena_url = arena_url.toString();

    const matched = navigator.userAgent.match(/YGOMobile\/(.+?) \((.+?) (\d+)\)/);
    if (matched) {
      this.build = {
        version_name: matched[1],
        application_id: matched[2],
        version_code: parseInt(matched[3])
      };
    }
  }

  search(key: string) {
    const url = new URL('http://www.ourocg.cn/S.aspx');
    url.searchParams.set('key', key);
    open(url.toString());
  }
}

interface BuildConfig {
  version_name: string;
  version_code: number;
  application_id: string;
}
