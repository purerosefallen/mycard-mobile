import { Injectable } from '@angular/core';
import * as path from 'path';
import * as webdav from 'webdav';
import { LoginService } from './login.service';
import './o';

interface DirectoryStats {
  'filename': string,
  'basename': string,
  'lastmod': string,
  'size': 0,
  'type': 'directory'
}


interface FileStats {
  'filename': string,
  'basename': string,
  'lastmod': string,
  'size': number,
  'type': 'file',
  'mime': string
}

type Stats = DirectoryStats | FileStats

@Injectable()
export class StorageService {
  client = webdav('https://api.mycard.moe/storage/', this.login.user.username, this.login.user.external_id.toString());


  working: boolean;

  constructor(private login: LoginService) {
  }

  async sync(app_id: string) {
    if (!window.ygopro.getFileLastModified) {
      throw 'storage sync not supported';
    }

    console.log('sync', 'start');
    this.working = true;


    const root = path.join('/', app_id);

    // 远程有 本地有
    //    远程=本地 更新记录
    //    远程>本地 下载
    //    远程<本地 上传
    // 远程有 本地无 记录无 下载
    // 远程有 本地无 记录有 删除远端
    // 远程无 本地有 记录无 上传
    // 远程无 本地有 记录有 删除本地
    // 远程无 本地无 记录有 更新记录
    const remote_files = new Map<string, boolean>();

    for await (const item of this.walk(root)) {
      const remote_path = item.filename;
      const local_path = path.relative(root, remote_path);
      const index_path = '_FILE_' + remote_path;
      const remote_time = Date.parse(item.lastmod);

      remote_files.set(local_path, true);
      const local_time = window.ygopro.getFileLastModified(local_path);

      if (local_time) {
        // 远端有，本地有

        if (local_time > remote_time) {
          // 远端有，本地有，远端>本地，下载
          await
            this.download(local_path, remote_path, index_path, remote_time);
        } else if (local_time < remote_time) {
          // 远端有，本地有，远端<本地，上传
          await
            this.upload(local_path, remote_path, index_path);
        }
      } else {
        // 远端有，本地无
        if (localStorage.getItem(index_path)) {
          // 远端有，本地无，记录有，删除远端
          await
            this.client.deleteFile(remote_path);
        } else {
          // 远端有，本地无，记录无，下载
          await
            this.download(local_path, remote_path, index_path, remote_time);
        }
      }
    }

    for (const local_path of this.local_files()) {
      const remote_path = path.join(root, local_path);
      const index_path = '_FILE_' + remote_path;

      if (!remote_files.has(local_path)) {
        // 远端无，本地有
        if (localStorage.getItem(index_path)) {
          // 远端无，本地有，记录有，删除本地
          window.ygopro.unlink(local_path);
        } else {
          // 远端无，本地有，记录无，上传
          await
            this.upload(local_path, remote_path, index_path);
        }
      }
    }

    console.log('sync', 'done');
    this.working = false;
  }

  async download(local_path: string, remote_path: string, index_path: string, time: number) {
    console.log('download', local_path, remote_path, index_path, time);
    const data: Uint8Array = await this.client.getFileContents(remote_path);
    window.ygopro.writeFile(local_path, Buffer.from(data.buffer).toString('base64'));
    window.ygopro.setFileLastModified(local_path, time);
    localStorage.setItem(local_path, time.toString());
  }

  async upload(local_path: string, remote_path: string, index_path: string) {
    console.log('upload', local_path, remote_path, index_path);
    const data = Buffer.from(window.ygopro.readFile(local_path), 'base64');
    await this.client.putFileContents(remote_path, data);
    const item: FileStats = await this.client.stat(remote_path);
    const time = Date.parse(item.lastmod);
    window.ygopro.setFileLastModified(local_path, time);
    localStorage.setItem(local_path, time.toString());
  }

  local_files() {
    return [
      ...this.local_files_do('deck', '.ydk'),
      ...this.local_files_do('replay', '.yrp'),
      ...this.local_files_do('single', '.lua'),
    ];
  }

  local_files_do(directory, extname): string[] {
    return JSON.parse(window.ygopro.readdir(directory))
      .filter(file => path.extname(file) === extname)
      .map(file => path.join(directory, file));
  }

  async *walk(dir: string): AsyncIterable<Stats> {
    const items: Stats[] = await this.client.getDirectoryContents(dir);
    for (let item of items) {
      if (item.type === 'directory') {
        yield* this.walk(item.filename);
      } else {
        yield item;
      }
    }
  }

}


// const local = window.ygopro.getFileStats(item.filename);
// const remote_mtime = Date.parse(item.lastmod);
// if (local.mtime >= remote_mtime) {
//   // 本地的较新，上传0
//   await client.putFileContents();
//
// }
