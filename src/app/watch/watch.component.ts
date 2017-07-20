import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { default_options, RoomListDataSource, servers, YGOProService } from '../ygopro.service';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.css']
})
export class WatchComponent implements OnInit {

  displayedColumns = ['mode', 'title', 'users', 'extra'];
  dataSource = new RoomListDataSource(servers, 'started');
  default_options = default_options;

  constructor(public ygopro: YGOProService, private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.changeDetector.detectChanges();
  }

}
