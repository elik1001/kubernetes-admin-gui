import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { MenuStateService } from '../menu-state-service';
import { Server } from '../dbConfigs/kubeServerConfig';
import { DataService } from '../data.service';
import { KubNodeDetails } from '../dbConfigs/kubNodeDetails';

import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.css']
})

export class NodesComponent {
  toggleForm: boolean;
  selectServer: Server;

  serverList: Server[] = [];
  nodeList: Server[] = [];
  nodeLinks = [];
  allNodeDetails = [];
  refreshTime = 0;

  displayedColumns = ['id', 'InternalIP', 'Hostname', 'nodeRole', 'OS', 'Arch', 'podCIDR', 'nodeStatus'];
  dataSource: MatTableDataSource<Element>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public state: MenuStateService,
    private dataService: DataService,
    private ref: ChangeDetectorRef,
  ) { }


  getServers() {
    this.dataService.getServerList()
      .subscribe(servers => {
        this.dataService.getKubeNodeList(servers[0].serverIp)
          .subscribe(nodes => {
            for (let i = 0; i < nodes['items'].length; i++) {
              this.nodeLinks[i] = this.dataService.getKubeNodeDetail(servers[0].serverIp, nodes['items'][i].metadata['selfLink'])
            }
            Observable.forkJoin(this.nodeLinks)
              .subscribe(nodeDetail => {
                for (let i = 0; i < nodeDetail.length; i++) {

                  // Display properties
                  podCIDR = nodeDetail[i]['spec']['podCIDR']
                  OS = nodeDetail[i]['metadata']['labels']['beta.kubernetes.io/os'];
                  Arch = nodeDetail[i]['metadata']['labels']['beta.kubernetes.io/arch'];

                  // Display all Nodes
                  for (let label in nodeDetail[i]['metadata']['labels']) {
                    if (label.includes('node-role.kubernetes.io/master')) {
                      nodeRole = nodeDetail[i]['metadata']['labels']['node-role.kubernetes.io/master'];
                    } else if (label.includes('node-role.kubernetes.io/node')) {
                      nodeRole = nodeDetail[i]['metadata']['labels']['node-role.kubernetes.io/node'];
                    }
                  }

                  // Display node Hostname / IP
                  for (let j = 0; j < nodeDetail[i]['status']['addresses'].length; j++) {
                    if (nodeDetail[i]['status']['addresses'][j].type === "InternalIP") {
                      InternalIP = nodeDetail[i]['status']['addresses'][j].address;
                    } else if (nodeDetail[i]['status']['addresses'][j].type === "Hostname") {
                      Hostname = nodeDetail[i]['status']['addresses'][j].address;
                    }
                  }

                  // Display node Status
                  for (let status in nodeDetail[i]['status']['conditions']) {
                    if (nodeDetail[i]['status']['conditions'][status]['type'].includes('Ready')) {
                      if (nodeDetail[i]['status']['conditions'][status]['status'] === "True") {
                        nodeStatus = "Active";
                      } else {
                        nodeStatus = nodeDetail[i]['status']['conditions'][status]['status'];
                      }
                    }
                  }
                  // Add to Object
                  allPodDetails[i] = {
                    "id": i + 1,
                    "InternalIP": InternalIP,
                    "Hostname": Hostname,
                    "nodeRole": nodeRole,
                    "OS": OS,
                    "Arch": Arch,
                    "podCIDR": podCIDR,
                    "nodeStatus": nodeStatus,
                    "color": podColor
                  }
                }
                //console.log(this.allNodeDetails);
                this.dataSource = new MatTableDataSource(allPodDetails);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              });
          });
      });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  ngOnInit() {
    this.getServers();
  }

  refresh(refreshTime) {
    interval = setInterval(() => {
      this.getServers();
    }, refreshTime);
    //this.ref.detectChanges();
    //this.paginator._changePageSize(this.paginator.pageSize);
  }

  ngOnDestroy() {

  }

  updateRefreshTime(refreshTime) {
    if (refreshTime == 0) {
      clearInterval(interval);
    } else {
      clearInterval(interval);
      refreshTime = refreshTime * 1000;
      this.refresh(refreshTime);
    }
  }

}

export interface Element {
  'id': number;
  'InternalIP': string;
  'Hostname': string;
  'nodeRole': string;
  'OS': string;
  'Arch': string;
  'podCIDR': string;
  'nodeStatus': string;
  'color': string;
}

let InternalIP, Hostname, nodeRole, OS, Arch, podCIDR, nodeStatus, podColor: string;
let allPodDetails: Element[] = [];
let interval;
