import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { LoginService } from '../login.service';
import { routerTransition } from '../router.animations';
import { YGOProService } from '../ygopro.service';

@Component({
  selector: 'app-windbot',
  templateUrl: './windbot.component.html',
  styleUrls: ['./windbot.component.css'],
  animations: routerTransition,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WindbotComponent {
  @HostBinding('@routerTransition') animation;

  constructor(public login: LoginService, public ygopro: YGOProService) {}
}
