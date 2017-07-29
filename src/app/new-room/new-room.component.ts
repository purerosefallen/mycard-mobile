import { Component, ElementRef, ViewChild } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { LoginService } from '../login.service';
import { routerTransition } from '../router.animations';
import { YGOProService } from '../ygopro.service';


@Component({
  selector: 'app-new-room',
  templateUrl: 'new-room.component.html',
  styleUrls: ['new-room.component.css'],
  animations: [routerTransition],
  host: { '[@routerTransition]': '' }
})
export class NewRoomComponent {

  @ViewChild('hostPasswordInput')
  hostPasswordInput: ElementRef;

  host_password = (this.login.user.external_id ^ 0x54321).toString();

  room = {
    title: this.login.user.username + '的房间',
    'private': false,
    options: { ...this.ygopro.default_options }
  };

  constructor(public ygopro: YGOProService, private login: LoginService, private snackBar: MdSnackBar) {
  }

  copy(host_password: string) {

    try {
      this.hostPasswordInput.nativeElement.select();

      if (document.execCommand('copy')) {
        this.snackBar.open(`房间密码 ${host_password} 已复制到剪贴板`, undefined, { duration: 3000 });
      } else {
        console.log('Oops, unable to copy');
      }
    } catch (error) {
      console.log(error);
    }

  }

  share(host_password: string) {
    this.ygopro.share('房间密码是' + host_password);
  }

  set_start_lp() {
    if (this.room.options.mode == 2) {
      this.room.options.start_lp = 16000;
    } else {
      this.room.options.start_lp = 8000;
    }
  }

}
