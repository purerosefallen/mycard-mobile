import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatTableModule,
  MatToolbarModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';
import 'rxjs/Rx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LobbyComponent } from './lobby/lobby.component';
import { MatchDialogComponent } from './match/match.component';
import { NewRoomComponent } from './new-room/new-room.component';
import { ResultDialogComponent } from './result/result.dialog';
import { RoomListComponent } from './room-list/room-list.component';
import { StorageService } from './storage.service';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { WatchComponent } from './watch/watch.component';
import { WindbotComponent } from './windbot/windbot.component';
import { YGOProService } from './ygopro.service';

@NgModule({
  declarations: [
    AppComponent,
    LobbyComponent,
    NewRoomComponent,
    RoomListComponent,
    MatchDialogComponent,
    WindbotComponent,
    WatchComponent,
    ToolbarComponent,
    ResultDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatTableModule,
    MatListModule,
    MatDialogModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    JsonpModule,
    MatMenuModule,
    MatProgressSpinnerModule
  ],
  providers: [YGOProService, StorageService],
  bootstrap: [AppComponent],
  entryComponents: [MatchDialogComponent, ResultDialogComponent]
})
export class AppModule {}
