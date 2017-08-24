import { animate, state, style, transition, trigger } from '@angular/animations';

export const routerTransition = trigger('routerTransition', [
  state('void', style({position: 'absolute', width: '100%'})),
  state('*', style({position: 'absolute', width: '100%'})),
  transition(':enter', [  // before 2.1: transition('void => *', [
    style({transform: 'translateX(100%)'}),
    animate('.5s ease-in-out', style({transform: 'translateX(0%)'}))
  ]),
  transition(':leave', [  // before 2.1: transition('* => void', [
    style({transform: 'translateX(0%)'}),
    animate('.5s ease-in-out', style({transform: 'translateX(100%)'}))
  ])
]);
export const routerTransition2 = trigger('routerTransition2', [
  state('void', style({position: 'absolute', width: '100%'})),
  state('*', style({position: 'absolute', width: '100%'})),
  transition(':enter', [  // before 2.1: transition('void => *', [
    style({transform: 'translateX(-100%)'}),
    animate('.5s ease-in-out', style({transform: 'translateX(0%)'}))
  ]),
  transition(':leave', [  // before 2.1: transition('* => void', [
    style({transform: 'translateX(0%)'}),
    animate('.5s ease-in-out', style({transform: 'translateX(-100%)'}))
  ])
]);
