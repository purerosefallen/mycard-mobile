import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { RoomListDataSource, YGOProService } from '../ygopro.service';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.css']
})
export class WatchComponent implements OnInit {

  displayedColumns = ['mode', 'title', 'users', 'extra'];
  dataSource = new RoomListDataSource(this.ygopro.servers, 'started');

  constructor(public login: LoginService, public ygopro: YGOProService, private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.changeDetector.detectChanges();
  }

}
