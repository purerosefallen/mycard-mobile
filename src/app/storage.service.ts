import { Injectable } from '@angular/core';
import * as path from 'path';
import * as webdav from 'webdav';
import { LoginService } from './login.service';

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
    if (!window.ygopro || !window.ygopro.getFileLastModified) {
      return;
    }

    // console.log('sync', 'start');

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
      // console.log('本地时间', local_path, local_time);

      if (local_time) {
        // 远端有，本地有

        if (local_time > remote_time) {
          // 远端有，本地有，远端>本地，下载
          await this.download(local_path, remote_path, index_path, remote_time);
        } else if (local_time < remote_time) {
          // 远端有，本地有，远端<本地，上传
          await this.upload(local_path, remote_path, index_path);
        }
      } else {
        // 远端有，本地无
        if (localStorage.getItem(index_path)) {
          // 远端有，本地无，记录有，删除远端
          await this.remove_remote(local_path, remote_path, index_path);
        } else {
          // 远端有，本地无，记录无，下载
          await this.download(local_path, remote_path, index_path, remote_time);
        }
      }
    }

    // console.log('远端文件扫描完毕', this.local_files());

    for (const local_path of this.local_files()) {
      const remote_path = path.join(root, local_path);
      const index_path = '_FILE_' + remote_path;

      if (!remote_files.has(local_path)) {
        // 远端无，本地有
        if (localStorage.getItem(index_path)) {
          // 远端无，本地有，记录有，删除本地
          await this.remove_local(local_path, remote_path, index_path);
        } else {
          // 远端无，本地有，记录无，上传
          await this.upload(local_path, remote_path, index_path);
        }
      }
    }

    // console.log('sync', 'done');
    this.working = false;
  }

  async download(local_path: string, remote_path: string, index_path: string, time: number) {
    this.working = true;
    // console.log('download', local_path, remote_path, index_path, time);
    const data: Uint8Array = await this.client.getFileContents(remote_path);
    window.ygopro.writeFile(local_path, Buffer.from(data.buffer).toString('base64'));
    window.ygopro.setFileLastModified(local_path, time);
    // console.log(local_path, time);
    localStorage.setItem(index_path, time.toString());
  }

  async upload(local_path: string, remote_path: string, index_path: string) {
    this.working = true;
    // console.log('upload', local_path, remote_path, index_path);
    const data = Buffer.from(window.ygopro.readFile(local_path), 'base64');
    await this.client.putFileContents(remote_path, data);
    const item: FileStats = await this.client.stat(remote_path);
    const time = Date.parse(item.lastmod);
    window.ygopro.setFileLastModified(local_path, time);
    // console.log(local_path, time);
    localStorage.setItem(index_path, time.toString());
  }

  // 其实没必要 async，只是看着整齐一点
  async remove_local(local_path: string, remote_path: string, index_path: string) {
    this.working = true;
    window.ygopro.unlink(local_path);
    localStorage.removeItem(index_path);
  }

  async remove_remote(local_path: string, remote_path: string, index_path: string) {
    this.working = true;
    await this.client.deleteFile(remote_path);
    localStorage.removeItem(index_path);
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

  async * walk(dir: string): AsyncIterable<Stats> {
    const items: Stats[] = await this.client.getDirectoryContents(dir);
    // console.log('取远端目录', dir, items);
    for (let item of items) {
      if (item.type === 'directory') {
        yield* this.walk(item.filename);
      } else {
        yield item;
      }
    }
  }
}
