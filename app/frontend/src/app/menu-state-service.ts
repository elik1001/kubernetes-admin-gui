import { Injectable } from '@angular/core';
import { Server } from './dbConfigs/kubeServerConfig';
import { DataService } from './data.service'

@Injectable()
export class MenuStateService {
  public disabled = {}
  serverList: Server[] = [];

  public constructor(public dataService: DataService) { }

  menuDisabled() {
    this.dataService.getServerList()
      .subscribe((servers: Server[]) => {
        this.serverList = servers;
        if (servers.length > 0) {
          this.disabled = { 'home': false, 'dashboard': false, 'nodes': false, 'pods': false, 'config': false, 'page51': false, 'page52': false };
        } else {
          this.disabled = { 'home': false, 'dashboard': true, 'nodes': true, 'pods': true, 'config': false, 'page51': true, 'page52': true };
        }
      })
  }

}
