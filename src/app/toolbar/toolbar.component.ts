import { Component } from '@angular/core';
import { routerTransition } from '../router.animations';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
  animations: [routerTransition]
})
export class ToolbarComponent {
  history = history;

  constructor() {}
}
