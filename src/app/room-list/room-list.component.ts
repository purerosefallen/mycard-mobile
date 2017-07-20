import { ChangeDetectorRef, Component } from '@angular/core';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import 'rxjs/Rx';
import { default_options, RoomListDataSource, servers, YGOProService } from '../ygopro.service';

@Component({
  selector: 'app-room-list',
  styleUrls: ['room-list.component.css'],
  templateUrl: 'room-list.component.html',
})
export class RoomListComponent {
  displayedColumns = ['title', 'users', 'mode', 'extra'];
  dataSource = new RoomListDataSource(servers.filter(server => server.custom));
  default_options = default_options;

  constructor(public ygopro: YGOProService, private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.changeDetector.detectChanges();
  }

}

