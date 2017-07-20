import { Component, ElementRef, ViewChild } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { LoginService } from '../login.service';
import { default_options, YGOProService } from '../ygopro.service';


@Component({
  selector: 'app-new-room',
  templateUrl: 'new-room.component.html',
  styleUrls: ['new-room.component.css']
})
export class NewRoomComponent {

  @ViewChild('hostPasswordRef')
  hostPasswordRef: ElementRef;

  host_password = (this.login.user.external_id ^ 0x54321).toString();

  room = {
    title: this.login.user.username + '的房间',
    'private': false,
    options: { ...default_options }
  };

  constructor(public ygopro: YGOProService, private login: LoginService, private snackBar: MdSnackBar) {
  }

  copy(host_password: string) {

    try {
      this.hostPasswordRef.nativeElement.select();

      if (document.execCommand('copy')) {
        this.snackBar.open(`房间密码 ${host_password} 已复制到剪贴板`, null, { duration: 3000 });
      } else {
        console.log('Oops, unable to copy');
      }
    } catch (error) {
      console.log(error);
    }

  }

  share(host_password: string) {

  }

}
