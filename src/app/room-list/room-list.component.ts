import { ChangeDetectorRef, Component } from '@angular/core';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import 'rxjs/Rx';
import { LoginService } from '../login.service';
import { RoomListDataSource, YGOProService } from '../ygopro.service';

import { routerTransition } from '../router.animations';


@Component({
  selector: 'app-room-list',
  styleUrls: ['room-list.component.css'],
  templateUrl: 'room-list.component.html',
  animations: [routerTransition],
  host: {'[@routerTransition]': ''}
})
export class RoomListComponent {
  displayedColumns = ['title', 'users', 'mode', 'extra'];
  dataSource = new RoomListDataSource(this.ygopro.servers.filter(server => server.custom));

  constructor(public login: LoginService, public ygopro: YGOProService, private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.changeDetector.detectChanges();
  }

}

