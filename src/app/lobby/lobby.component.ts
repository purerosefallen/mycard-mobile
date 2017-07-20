import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Http, Jsonp } from '@angular/http';
import { MdDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { LoginService } from '../login.service';
import { MatchDialog } from '../match/match.component';
import { YGOProService } from '../ygopro.service';


@Component({
  selector: 'app-lobby',
  templateUrl: 'lobby.component.html',
  styleUrls: ['lobby.component.css']
})
export class LobbyComponent {

  searchCtrl: FormControl;
  suggestion: any;
  key: string;

  arena_url: string;

  constructor(public login: LoginService, public ygopro: YGOProService, public dialog: MdDialog, private http: Http, private jsonp: Jsonp, private route: ActivatedRoute) {

    this.searchCtrl = new FormControl();
    this.suggestion = this.searchCtrl.valueChanges.flatMap(name => name ? this.jsonp.get('http://www.ourocg.cn/Suggest.aspx', {
      params: { callback: 'JSONP_CALLBACK', key: name }
    }).map(response => response.json().result) : []);

    // this.jsonp.get('http://www.ourocg.cn/Suggest.aspx', {
    //   params: {
    //     callback: 'JSONP_CALLBACK',
    //     key: 'xy'
    //   }
    // }).map(response => response.json().result).toPromise().then(data => console.log(data));

    const arena_url = new URL('https://mycard.moe/ygopro/arena');
    arena_url.searchParams.set('sso', login.token);
    this.arena_url = arena_url.toString();
  }

  async request_match(arena: string) {
    this.dialog.open(MatchDialog, { data: arena, disableClose: true });

  }

  search(key) {
    const url = new URL('http://www.ourocg.cn/S.aspx');
    url.searchParams.set('key', key);
    open(url.toString());
  }

}
