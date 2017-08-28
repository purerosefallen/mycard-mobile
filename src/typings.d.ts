/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

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
    updateUser(name: string, avatar: string, status: string): void

    readFile(path: string): string
    writeFile(path: string, data: string): string
    readdir(path: string): string
    unlink(path: string): boolean
    getFileLastModified(path: string): number
    setFileLastModified(path: string, time: number): void

  };
}
