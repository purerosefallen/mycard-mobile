import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LobbyComponent } from './lobby/lobby.component';
import { LoginService } from './login.service';
import { NewRoomComponent } from './new-room/new-room.component';
import { RoomListComponent } from './room-list/room-list.component';
import { WatchComponent } from './watch/watch.component';
import { WindbotComponent } from './windbot/windbot.component';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [AuthGuard],
    children: [
      { path: '', redirectTo: '/ygopro/lobby', pathMatch: 'full' },
      { path: 'ygopro/rooms/new', component: NewRoomComponent },
      { path: 'ygopro/rooms', component: RoomListComponent },
      { path: 'ygopro/lobby', component: LobbyComponent },
      { path: 'ygopro/windbot', component: WindbotComponent },
      { path: 'ygopro/watch', component: WatchComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  providers: [AuthGuard, LoginService],
})
export class AppRoutingModule {
}
