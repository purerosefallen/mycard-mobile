import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { LoginService } from '../login.service';

const second = 1000;
const offset = new Date().getTimezoneOffset() * 60 * second;

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchDialog implements OnInit, OnDestroy {

  expect_wait = this.http.get('https://api.mycard.moe/ygopro/match/stats/' + this.arena).map(response => response.json() * second + offset);
  actual_wait = Observable.timer(0, second).map(timestamp => timestamp * second + offset);

  matching: Subscription;

  constructor(@Inject(MD_DIALOG_DATA) public arena: string, private dialogRef: MdDialogRef<MatchDialog>, private http: Http, private login: LoginService) {
  }

  ngOnInit() {
    this.matching = this.http.post('https://api.mycard.moe/ygopro/match', null, {
      headers: new Headers({ Authorization: 'Basic ' + Buffer.from(this.login.user.username + ':' + this.login.user.external_id).toString('base64') }),
      params: { arena: this.arena, locale: 'zh-CN' }
    }).map(response => response.json()).subscribe((data) => {
      this.dialogRef.close(data);
    }, (error) => {
      alert(`匹配失败`);
      this.dialogRef.close();
    });
  }

  ngOnDestroy() {
    this.matching.unsubscribe();
  }

}
