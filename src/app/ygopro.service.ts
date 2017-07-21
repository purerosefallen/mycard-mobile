import { DataSource } from '@angular/cdk';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { sortBy } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { LoginService } from './login.service';

export interface User {
  admin: boolean;
  avatar_url: string;
  email: string;
  external_id: number;
  moderator: boolean;
  name: string;
  username: string;
}

export interface Room {
  id?: string;
  title?: string;
  server?: Server;
  'private'?: boolean;
  options: Options;
  arena?: string;
  users?: { username: string, position: number }[];
}
export interface Options {
  mode: number;
  rule: number;
  start_lp: number;
  start_hand: number;
  draw_count: number;
  enable_priority: boolean;
  no_check_deck: boolean;
  no_shuffle_deck: boolean;
  lflist?: number;
  time_limit?: number;
}


export interface Server {
  id?: string;
  url?: string;
  address: string;
  port: number;
  custom?: boolean;
  replay?: boolean;
}

class News {
  title: string;
  text: string;
  url: string;
  image: string;
  updated_at: Date;
}

interface YGOProData {
  windbot: { [locale: string]: string[] };
}

interface App {
  id: string,
  news: { [locale: string]: News[] },
  windbot: { [locale: string]: string[] },
  data: any
}

@Injectable()
export class YGOProService {

  news: News[];
  windbot: string[];
  topics: Observable<any>;

  readonly default_options: Options = {
    mode: 1,
    rule: 0,
    start_lp: 8000,
    start_hand: 5,
    draw_count: 1,
    enable_priority: false,
    no_check_deck: false,
    no_shuffle_deck: false,
    lflist: 0,
    time_limit: 180
  };

  readonly servers: Server[] = [{
    id: 'tiramisu',
    url: 'wss://tiramisu.mycard.moe:7923',
    address: '112.124.105.11',
    port: 7911,
    custom: true,
    replay: true
  }, {
    id: 'tiramisu-athletic',
    url: 'wss://tiramisu.mycard.moe:8923',
    address: '112.124.105.11',
    port: 8911,
    custom: false,
    replay: true
  }];

  constructor(private login: LoginService, private http: Http) {
    this.load().catch(alert);
  }

  async load() {
    const apps: App[] = await this.http.get('https://api.mycard.moe/apps.json').map(response => response.json()).toPromise();
    const app = apps.find(app => app.id === 'ygopro');
    this.news = app.news['zh-CN'];
    this.windbot = (<YGOProData>app.data).windbot['zh-CN'];
    // this.topics = this.http.get('https://ygobbs.com/top.json').flatMap(response => promisify(parseString)(response.text())).map(doc => {
    //   console.log(doc['rss'].channel[0].item)
    //   return doc['rss'].channel[0].item;
    // });
    this.topics = this.http.get('https://ygobbs.com/top/quarterly.json').map(response => response.json().topic_list.topics.slice(0, 5).map(topic => ({
      ...topic,
      url: new URL(`/t/${topic.slug}/${topic.id}`, 'https://ygobbs.com').toString(),
      image_url: topic.image_url && new URL(topic.image_url, 'https://ygobbs.com').toString()
    })));

  }

  create_room(room: Room, host_password: string) {
    let options_buffer = Buffer.alloc(6);
    // 建主密码 https://docs.google.com/document/d/1rvrCGIONua2KeRaYNjKBLqyG9uybs9ZI-AmzZKNftOI/edit
    options_buffer.writeUInt8((room.private ? 2 : 1) << 4, 1);
    options_buffer.writeUInt8(
      room.options.rule << 5 |
      room.options.mode << 3 |
      (room.options.enable_priority ? 1 << 2 : 0) |
      (room.options.no_check_deck ? 1 << 1 : 0) |
      (room.options.no_shuffle_deck ? 1 : 0)
      , 2);
    options_buffer.writeUInt16LE(room.options.start_lp, 3);
    options_buffer.writeUInt8(room.options.start_hand << 4 | room.options.draw_count, 5);
    let checksum = 0;
    for (let i = 1; i < options_buffer.length; i++) {
      checksum -= options_buffer.readUInt8(i);
    }
    options_buffer.writeUInt8(checksum & 0xFF, 0);

    let secret = this.login.user.external_id % 65535 + 1;
    for (let i = 0; i < options_buffer.length; i += 2) {
      options_buffer.writeUInt16LE(options_buffer.readUInt16LE(i) ^ secret, i);
    }

    let password = options_buffer.toString('base64') + (room.private ? host_password :
        room.title!.replace(/\s/, String.fromCharCode(0xFEFF)));
    // let room_id = crypto.createHash('md5').update(password + this.loginService.user.username).digest('base64')
    //     .slice(0, 10).replace('+', '-').replace('/', '_');

    // if (room.private) {
    //   new Notification('YGOPro 私密房间已建立', {
    //     body: `房间密码是 ${this.host_password}, 您的对手可在自定义游戏界面输入密码与您对战。`
    //   });
    // }
    this.join(password, this.servers[0]);
  }

  join_room(room: Room) {
    let options_buffer = new Buffer(6);
    options_buffer.writeUInt8(3 << 4, 1);
    let checksum = 0;
    for (let i = 1; i < options_buffer.length; i++) {
      checksum -= options_buffer.readUInt8(i);
    }
    options_buffer.writeUInt8(checksum & 0xFF, 0);

    let secret = this.login.user.external_id % 65535 + 1;
    for (let i = 0; i < options_buffer.length; i += 2) {
      options_buffer.writeUInt16LE(options_buffer.readUInt16LE(i) ^ secret, i);
    }

    let name = options_buffer.toString('base64') + room.id;

    this.join(name, room.server!);
  }

  join_private(password: string) {
    let options_buffer = new Buffer(6);
    options_buffer.writeUInt8(5 << 4, 1);
    let checksum = 0;
    for (let i = 1; i < options_buffer.length; i++) {
      checksum -= options_buffer.readUInt8(i);
    }
    options_buffer.writeUInt8(checksum & 0xFF, 0);

    let secret = this.login.user.external_id % 65535 + 1;
    for (let i = 0; i < options_buffer.length; i += 2) {
      options_buffer.writeUInt16LE(options_buffer.readUInt16LE(i) ^ secret, i);
    }

    let name = options_buffer.toString('base64') + password.replace(/\s/, String.fromCharCode(0xFEFF));

    this.join(name, this.servers[0]);
  }

  join_windbot(name?: string) {
    if (!name) {
      name = this.windbot[Math.floor(Math.random() * this.windbot.length)];
    }
    return this.join('AI#' + name, this.servers[0]);
  }

  join(password, server) {
    try {
      window.ygopro.join(server.address, server.port, this.login.user.username, password);
    } catch (error) {
      console.error(error);
      alert(JSON.stringify({
        method: 'join',
        params: [server.address, server.port, this.login.user.username, password]
      }));
    }
  }

  edit_deck() {
    try {
      window.ygopro.edit_deck();
    } catch (error) {
      console.error(error);
      alert(JSON.stringify({ method: 'edit_deck', params: [] }));
    }
  }

  watch_replay() {
    try {
      window.ygopro.watch_replay();
    } catch (error) {
      console.error(error);
      alert(JSON.stringify({ method: 'watch_replay', params: [] }));
    }
  }

  single_mode() {
    try {
      window.ygopro.puzzle_mode();
    } catch (error) {
      console.error(error);
      alert(JSON.stringify({ method: 'puzzle_mode', params: [] }));
    }
  }

  openDrawer() {
    try {
      window.ygopro.openDrawer();
    } catch (error) {
      console.error(error);
      alert(JSON.stringify({ method: 'openDrawer', params: [] }));
    }
  }

  backHome() {
    try {
      window.ygopro.backHome();
    } catch (error) {
      console.error(error);
      alert(JSON.stringify({ method: 'backHome', params: [] }));
    }
  }

  share(text: string) {
    try {
      window.ygopro.share(text);
    } catch (error) {
      console.error(error);
      alert(JSON.stringify({ method: 'share', params: [text] }));
    }
  }

}


type Message =
  { event: 'init', data: Room[] }
  | { event: 'update', data: Room }
  | { event: 'create', data: Room }
  | { event: 'delete', data: string }

export class RoomListDataSource extends DataSource<any> {

  constructor(private servers: Server[], private filter = 'waiting') {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Room[]> {

    return Observable.combineLatest(this.servers.map(server => {
        const url = new URL(server.url);
        url.searchParams.set('filter', this.filter);
        return Observable.webSocket({ url: url.toString() })
          .scan((rooms: Room[], message: Message) => {
            switch (message.event) {
              case 'init':
                return message.data.map(room => ({ server: server, ...room }));
              case 'create':
                return rooms.concat({ server: server, ...message.data });
              case 'update':
                Object.assign(rooms.find(room => room.id === message.data.id), message.data);
                return rooms;
              case 'delete':
                return rooms.filter(room => room.id != message.data);
            }
          }, []);
      }
    ), (...sources) => [].concat(...sources)).map(rooms => sortBy(rooms, (room) => {
        if (room.arena === 'athletic') {
          return 0;
        } else if (room.arena === 'entertain') {
          return 1;
        } else if (room.id!.startsWith('AI#')) {
          return 5;
        } else {
          return room.options.mode + 2;
        }
      })
    );
  }

  disconnect() {
  }

}


declare global {
  interface Window {
    ygopro: {

      // 加入房间
      join (address: string, port: number, username: string, password: string): void

      // 编辑卡组
      edit_deck (): void

      // 观看录像，进入观看录像界面
      watch_replay(): void

      // 残局模式
      puzzle_mode(): void

      openDrawer(): void
      backHome(): void
      share(text: string): void
    };
  }
}
