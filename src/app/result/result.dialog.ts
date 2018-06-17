import { Component, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { LoginService } from '../login.service';
import { MatchDialogComponent } from '../match/match.component';

@Component({
  selector: 'app-result',
  templateUrl: './result.dialog.html',
  styleUrls: ['./result.dialog.css']
})
export class ResultDialogComponent {
  result: 'win' | 'lose' | 'draw';
  dp: string | undefined;
  exp: string | undefined;
  firstWin: string | undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public last: any,
              public login: LoginService,
              private http: Http,
              public dialog: MatDialog,
              private dialogRef: MatDialogRef<MatchDialogComponent>) {
    if (this.last.userscorea === this.last.userscoreb) {
      this.result = 'draw';
    } else if (this.last.winner === this.login.user.username) {
      this.result = 'win';
    } else {
      this.result = 'lose';
    }

    const index = this.last.usernamea === this.login.user.username ? 'a' : 'b';

    if (this.last.isfirstwin && this.result === 'win') {
      this.dp = this.format(this.last[`pt${index}`] - 4, this.last[`pt${index}_ex`]);
      this.firstWin = this.format(4);
    } else {
      this.dp = this.format(this.last[`pt${index}`], this.last[`pt${index}_ex`]);
    }
    this.exp = this.format(this.last[`exp${index}`], this.last[`exp${index}_ex`]);
  }

  format(current: number, ex: number = 0) {
    const result = Math.round(current) - Math.round(ex);
    return result ? `${(result < 0 ? '' : '+')}${Math.round(result)}` : undefined;
  }

  again() {
    this.dialogRef.close(true);
  }
}
