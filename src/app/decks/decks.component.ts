import { Component, OnInit } from '@angular/core';
import { YGOProService } from '../ygopro.service';
import { StorageService } from '../storage.service';
import * as path from 'path';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-decks',
  templateUrl: './decks.component.html',
  styleUrls: ['./decks.component.css']
})
export class DecksComponent implements OnInit {
  history = history;
  decks: string[] = ['test1'];

  constructor(private ygopro: YGOProService, private storage: StorageService, private dialog: MatDialog) {}

  ngOnInit() {
    if (!window.ygopro) {
      return;
    }
    this.decks = this.storage.local_files_do('deck', '.ydk').map(file => path.basename(file, '.ydk'));

    // for (const file of ) {
    //   // const data = this.storage.read_local(file);
    //   console.log(file, data);
    // }
  }

  async remove(deck: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: [deck] });
    if (await dialogRef.afterClosed().toPromise()) {
      this.decks.splice(this.decks.indexOf(deck), 1);
      return this.storage.remove(path.join('deck', `${deck}.ydk`));
    }
  }

  async edit(deck: string) {
    this.ygopro.edit_deck(deck);
  }

  async share() {}
}
