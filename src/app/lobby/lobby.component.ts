import { Component, HostBinding } from '@angular/core';
import { FormControl } from '@angular/forms';
import { environment } from '../../environments/environment';
import { LoginService } from '../login.service';
import { routerTransition2 } from '../router.animations';
import { StorageService } from '../storage.service';
import { YGOProService } from '../ygopro.service';

import { HttpClient } from '@angular/common/http';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/internal/operators';

@Component({
  selector: 'app-lobby',
  templateUrl: 'lobby.component.html',
  styleUrls: ['lobby.component.css'],
  animations: [routerTransition2]
})
export class LobbyComponent {
  @HostBinding('@routerTransition2') animation: '';

  version = environment.version;
  build: BuildConfig;

  searchControl = new FormControl();
  suggestion = this.searchControl.valueChanges.pipe(
    distinctUntilChanged(),
    filter(name => name),
    switchMap(name => this.http.get<{ value: string }[]>(`https://api.mycard.moe/ygopro/suggest/${name}`)),
    map(data => data.map(item => item.value))
  );

  key: string;

  arena_url: string;

  constructor(public login: LoginService, public ygopro: YGOProService, private http: HttpClient, public storage: StorageService) {
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
