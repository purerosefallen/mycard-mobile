import { animate, state, style, transition, trigger } from '@angular/animations';

const enter = transition(':enter', animate('175ms cubic-bezier(0, 0, .2, 1)'));
const leave = transition(':leave', animate('175ms cubic-bezier(.4, 0, 1, 1)'));

export const routerTransition = [
  trigger('routerTransition', [
    state('void', style({ transform: 'translateY(164px)', opacity: 0 })),
    state('*', style({ transform: 'translateY(0)', opacity: 1 })),
    enter,
    leave
  ]),
  // trigger('toolbarTransition', [
  //   transition(':enter', [
  //     style({  opacity: 0 }),
  //     animate('175ms cubic-bezier(0, 0, .2, 1)')
  //   ]),
  //   transition(':leave', [
  //     style({ opacity: 1 }),
  //     animate('175ms cubic-bezier(.4, 0, 1, 1)', style({ opacity: 0 }))
  //   ])
  // ]),

  trigger('routerTransition2', [
    state('void', style({ transform: 'translateY(-24px)' })),
    state('*', style({ transform: 'translateY(0)' })),
    enter,
    leave
  ])
];
