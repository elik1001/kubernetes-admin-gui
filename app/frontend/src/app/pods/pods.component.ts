import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { MenuStateService } from '../menu-state-service';

import { Server } from '../dbConfigs/kubeServerConfig';
import { DataService } from '../data.service';
import { KubNodeDetails } from '../dbConfigs/kubNodeDetails';

import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-pods',
  templateUrl: './pods.component.html',
  styleUrls: ['./pods.component.css']
})

export class PodsComponent implements OnDestroy, OnInit {

  serverList: Server[] = [];
  refreshTime = 0;

  displayedColumns = ['id', 'fullNodeName', 'podName', 'hostIP', 'podIP', 'nodeName', 'podNamespace', 'podStatus'];
  dataSource: MatTableDataSource<Element>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public state: MenuStateService,
    private dataService: DataService,
    private ref: ChangeDetectorRef,
  ) { }

  getData() {
    this.dataService.getServerList()
      .subscribe(servers => {
        this.dataService.getKubePodList(servers[0].serverIp)
          .subscribe(pods => {
            //console.log(pods['items']);
            for (let i = 0; i < pods['items'].length; i++) {
              if (pods['items'][i].status.conditions[1].status === "False") {
                podColor = "red";
              } else if (pods['items'][i].status.conditions[1].status === "True") {
                podColor = "green";
              } else {
                podColor = "yellow";
              }
              allPodDetails[i] = {
                "id": i + 1,
                "fullNodeName": pods['items'][i].metadata.name,
                "hostIP": pods['items'][i].status.hostIP,
                "podIP": pods['items'][i].status.podIP,
                "podStatus": pods['items'][i].status.conditions[1].status,
                "podName": pods['items'][i].status.containerStatuses[0].name,
                "nodeName": pods['items'][i].spec.nodeName,
                "podNamespace": pods['items'][i].metadata.namespace,
                "color": podColor
              }
              //this.allPodDetails[i]["podImageName"] = pods['items'][i].status.containerStatuses[0].image;
            }
            //console.log(allPodDetails);
            this.dataSource = new MatTableDataSource(allPodDetails);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
      })
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  ngOnInit() {
    this.getData()
  }

  refresh(refreshTime) {
    interval = setInterval(() => {
      this.getData();
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
  id: number;
  fullNodeName: string;
  podName: string;
  hostIP: string;
  podIP: string;
  nodeName: string;
  podNamespace: string;
  podStatus: string;
  color: string;
}

let podColor: string;
let allPodDetails: Element[] = [];
let interval;
