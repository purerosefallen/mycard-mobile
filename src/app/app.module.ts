import { CdkTableModule } from '@angular/cdk';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import {
  MdAutocompleteModule,
  MdButtonModule,
  MdCardModule,
  MdCheckboxModule,
  MdDialogModule,
  MdGridListModule,
  MdIconModule,
  MdInputModule,
  MdListModule,
  MdMenuModule, MdProgressSpinnerModule,
  MdSelectModule,
  MdSlideToggleModule,
  MdSnackBarModule,
  MdTableModule,
  MdToolbarModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';
import 'rxjs/Rx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LobbyComponent } from './lobby/lobby.component';
import { MatchDialog } from './match/match.component';
import { NewRoomComponent } from './new-room/new-room.component';
import { ResultDialog } from './result/result.dialog';
import { RoomListComponent } from './room-list/room-list.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { WatchComponent } from './watch/watch.component';
import { WindbotComponent } from './windbot/windbot.component';
import { YGOProService } from './ygopro.service';
import { DecksComponent } from './decks/decks.component';
import { DragulaModule } from 'ng2-dragula';
import { SaveService } from './save.service';

@NgModule({
  declarations: [
    AppComponent,
    LobbyComponent,
    NewRoomComponent,
    RoomListComponent,
    MatchDialog,
    WindbotComponent,
    WatchComponent,
    ToolbarComponent,
    ResultDialog,
    DecksComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MdInputModule,
    MdSelectModule,
    MdCheckboxModule,
    MdButtonModule,
    MdSlideToggleModule,
    MdCardModule,
    MdGridListModule,
    MdIconModule,
    MdTableModule,
    CdkTableModule,
    MdListModule,
    MdDialogModule,
    MdToolbarModule,
    MdSnackBarModule,
    MdAutocompleteModule,
    ReactiveFormsModule,
    JsonpModule,
    MdMenuModule,
    MdProgressSpinnerModule,
    DragulaModule
  ],
  providers: [YGOProService, SaveService],
  bootstrap: [AppComponent],
  entryComponents: [MatchDialog, ResultDialog],
})
export class AppModule {
}
