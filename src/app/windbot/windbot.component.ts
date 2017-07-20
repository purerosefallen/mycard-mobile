import { Component } from '@angular/core';
import { YGOProService } from '../ygopro.service';

@Component({
  selector: 'app-windbot',
  templateUrl: './windbot.component.html',
  styleUrls: ['./windbot.component.css']
})
export class WindbotComponent {

  constructor(public ygopro: YGOProService) {
  }
}
