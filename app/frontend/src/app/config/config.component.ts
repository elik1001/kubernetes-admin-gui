import { Component, OnInit } from '@angular/core';
import { MenuStateService } from '../menu-state-service';
import { Server } from '../dbConfigs/kubeServerConfig';
import { DataService } from '../data.service'

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent {
  serverList: Server[] = [];
  toggleForm: boolean;
  selectServer: Server;

  constructor(
    public state: MenuStateService,
    private dataService: DataService
  ) { }

  getServers() {
    this.dataService.getServerList()
      .subscribe((servers: Server[]) => {
        this.serverList = servers;
      })
  }

  addServer(form) {
    let newServer: Server = {
      serverIp: form.value.serverIp,
      serverName: form.value.serverName
    }
    this.dataService.addServer(newServer)
      .subscribe(serverip => {
        this.getServers();
      })
  }

  deleteServer(id) {
    this.dataService.deleteServer(id)
      .subscribe((data: any) => {
        if (data.n == 1) {
          for (var i = 0; i <= this.serverList.length; i++) {
            if (id == this.serverList[i]._id) {
              this.serverList.splice(i, 1);
            }
          }
        }
      })
  }

  editServer(form) {
    let newServer: Server = {
      _id: this.selectServer._id,
      serverIp: form.value.serverIp,
      serverName: form.value.serverName
    }
    this.dataService.updateServer(newServer)
      .subscribe(result => {
        this.getServers();
      })
    this.toggleForm = !this.toggleForm;
  }

  showEditForm(server) {
    this.selectServer = server;
    this.toggleForm = !this.toggleForm;
  }

  ngOnInit() {
    this.getServers();
  }
}
