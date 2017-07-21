import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { LoginService } from '../login.service';
import { YGOProService } from '../ygopro.service';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchDialog implements OnInit, OnDestroy {

  expect_wait = this.http.get('https://api.mycard.moe/ygopro/match/stats/' + this.arena).map(response => new Date(response.json() * 1000));
  actual_wait = Observable.timer(0, 1000).map(timestamp => new Date(timestamp * 1000));

  matching: Subscription;

  constructor(@Inject(MD_DIALOG_DATA) public arena: string, private dialogRef: MdDialogRef<MatchDialog>, private http: Http, private login: LoginService, private ygopro: YGOProService) {
  }

  ngOnInit() {
    this.matching = this.http.post('https://api.mycard.moe/ygopro/match', null, {
      headers: new Headers({ Authorization: 'Basic ' + Buffer.from(this.login.user.username + ':' + this.login.user.external_id).toString('base64') }),
      params: { arena: this.arena, locale: 'zh-CN' }
    }).map(response => response.json()).subscribe((data) => {
      this.ygopro.join(data['password'], { address: data['address'], port: data['port'] });
      this.dialogRef.close();
    }, (error) => {
      alert(`匹配失败`);
      this.dialogRef.close();
    });
  }

  ngOnDestroy() {
    this.matching.unsubscribe();
  }

}
