import { Component } from '@angular/core';
import { LoginService } from '../login.service';
import { YGOProService } from '../ygopro.service';
import { routerTransition } from '../router.animations';

@Component({
  selector: 'app-windbot',
  templateUrl: './windbot.component.html',
  styleUrls: ['./windbot.component.css'],
  animations: [routerTransition],
  host: {'[@routerTransition]': ''}
})
export class WindbotComponent {

  constructor(public login: LoginService, public ygopro: YGOProService) {
  }
}
