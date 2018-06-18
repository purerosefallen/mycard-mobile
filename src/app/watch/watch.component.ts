import { ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { routerTransition } from '../router.animations';
import { RoomListDataSource, YGOProService } from '../ygopro.service';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.css'],
  animations: routerTransition
})
export class WatchComponent implements OnInit {
  @HostBinding('@routerTransition') animation;

  displayedColumns = ['mode', 'title', 'users', 'extra'];
  dataSource = new RoomListDataSource(this.ygopro.servers, 'started');

  constructor(public login: LoginService, public ygopro: YGOProService, private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    this.changeDetector.detectChanges();
  }
}
