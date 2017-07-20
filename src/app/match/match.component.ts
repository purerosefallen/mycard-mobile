import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchDialog {

  expect_wait = new Date(1);
  actual_wait = Observable.timer(0, 1000).map(timestamp => new Date(timestamp * 1000));

  constructor(@Inject(MD_DIALOG_DATA) public arena: string) {
  }

}
