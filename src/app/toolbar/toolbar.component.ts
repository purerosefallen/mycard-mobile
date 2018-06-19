import { ChangeDetectionStrategy, Component } from '@angular/core';
import { routerTransition } from '../router.animations';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
  animations: [routerTransition],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent {
  history = history;

  constructor() {}
}
