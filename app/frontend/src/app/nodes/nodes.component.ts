import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy, Input, Inject } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

import { MenuStateService } from '../menu-state-service';
import { Server } from '../dbConfigs/kubeServerConfig';
import { DataService } from '../data.service';
import { KubNodeDetails } from '../dbConfigs/kubNodeDetails';
import { ConfirmationDialogComponent } from '../dialogs/confirmation-dialog/confirmation-dialog.component';
import { DialogsService } from '../dialogs/dialogs.service';

import { Observable } from 'rxjs/Rx';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkDetailRowDirective } from '../cdk-detail-row.directive';

@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.css'],
  animations: [
    trigger('detailExpand', [
      state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class NodesComponent {
  toggleForm: boolean;
  selectServer: Server;

  dialogRef: MatDialogRef<ConfirmationDialogComponent>;
  serverList: Server[] = [];
  nodeList: Server[] = [];
  nodeLinks = [];
  allNodeDetails = [];
  refreshTime = 0;
  displayedColumns = ['id', 'InternalIP', 'Hostname', 'nodeRole', 'OS', 'Arch', 'podCIDR', 'nodeStatus', 'buttons'];
  dataSource: MatTableDataSource<Element>;
  isExpansionDetailRow = (index, row) => row.hasOwnProperty('detailRow');

  //@Input() singleChildRowDetail: boolean;

  public expandIcon = 'keyboard_arrow_right';
  private openedRow: CdkDetailRowDirective;

  onToggleChange(cdkDetailRow: CdkDetailRowDirective): void {
    let singleChildRowDetail = true;
    if (singleChildRowDetail && this.openedRow && this.openedRow.expended) {
      this.openedRow.toggle();
    }
    this.openedRow = cdkDetailRow.expended ? cdkDetailRow : undefined;
    //console.log(cdkDetailRow.vcRef.element.nativeElement.childNodes[1].childNodes[1].childNodes["0"].nodeValue);
    if (this.openedRow && this.openedRow.expended) {
      cdkDetailRow.vcRef.element.nativeElement.childNodes[1].childNodes[1].childNodes["0"].nodeValue = 'keyboard_arrow_down';
    } else {
      cdkDetailRow.vcRef.element.nativeElement.childNodes[1].childNodes[1].childNodes["0"].nodeValue = 'keyboard_arrow_right';
    }
  }

  //startEdit(i: number, id: number, title: string, state: string, url: string, created_at: string, updated_at: string) {
  //id = id;
  // index row is used just for debugging proposes and can be removed
  //let index = i;
  //console.log(index);
  /*
      const dialogRef = this.dialog.open(EditDialogComponent, {
        data: { id: id, title: title, state: state, url: url, created_at: created_at, updated_at: updated_at }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === 1) {
          // When using an edit things are little different, firstly we find record inside DataService by id
          const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
          // Then you update that record using data from dialogData (values you enetered)
          this.exampleDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
          // And lastly refresh table
          this.refreshTable();
        }
      });
  */
  //}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public state: MenuStateService,
    public snackBar: MatSnackBar,
    private dataService: DataService,
    private ref: ChangeDetectorRef,
    private dialogsService: DialogsService,
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
                  //console.log(nodeDetail[i]);

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

                  for (let status in nodeDetail[i]['status']['conditions']) {
                    if (nodeDetail[i]['status']['conditions'][status]['type'].includes('OutOfDisk')) {
                      outOfDiskReason = nodeDetail[i]['status']['conditions'][status]['reason'];
                      outOfDiskStatus = nodeDetail[i]['status']['conditions'][status]['status'];
                      outOfDiskType = nodeDetail[i]['status']['conditions'][status]['type'];
                    }
                    if (nodeDetail[i]['status']['conditions'][status]['type'].includes('MemoryPressure')) {
                      memoryPressureReason = nodeDetail[i]['status']['conditions'][status]['reason'];
                      memoryPressureStatus = nodeDetail[i]['status']['conditions'][status]['status'];
                      memoryPressureType = nodeDetail[i]['status']['conditions'][status]['type'];
                    }
                    if (nodeDetail[i]['status']['conditions'][status]['type'].includes('DiskPressure')) {
                      diskPressureReason = nodeDetail[i]['status']['conditions'][status]['reason'];
                      diskPressureStatus = nodeDetail[i]['status']['conditions'][status]['status'];
                      diskPressureType = nodeDetail[i]['status']['conditions'][status]['type'];
                    }
                  }
                  // Display node Status
                  for (let status in nodeDetail[i]['status']['conditions']) {
                    if (nodeDetail[i]['status']['conditions'][status]['type'].includes('Ready')) {
                      if (nodeDetail[i]['status']['conditions'][status]['status'] === "False") {
                        podColor = "red";
                        nodeStatus = "False"
                      } else if (nodeDetail[i]['status']['conditions'][status]['status'] === "True") {
                        podColor = "green";
                        nodeStatus = "Active";
                      } else {
                        podColor = "orange";
                        nodeStatus = nodeDetail[i]['status']['conditions'][status]['status'];
                      }
                    } else {
                      podColor = "brown";
                      nodeStatus = "Unavailable";
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
                    "color": podColor,
                    'outOfDiskReason': outOfDiskReason,
                    'outOfDiskStatus': outOfDiskStatus,
                    'outOfDiskType': outOfDiskType,
                    'memoryPressureReason': memoryPressureReason,
                    'memoryPressureStatus': memoryPressureStatus,
                    'memoryPressureType': memoryPressureType,
                    'diskPressureReason': diskPressureReason,
                    'diskPressureStatus': diskPressureStatus,
                    'diskPressureType': diskPressureType,
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

  /*
    onRowClicked(row) {
      if (typeof row != 'undefined') {
        if (row.path["0"].childNodes["0"].nodeValue === 'keyboard_arrow_right') {
          row.path["0"].childNodes["0"].nodeValue = "keyboard_arrow_down";
        } else if (row.path["0"].childNodes["0"].nodeValue === 'keyboard_arrow_down') {
          row.path["0"].childNodes["0"].nodeValue = "keyboard_arrow_right";
        }
      }
    }
  */

  nodeEdit(nodeID) {
    this.snackBar.open(
      'Coming soon!!!',
      "X",
      {
        announcementMessage: "test",
        duration: 7000,
        panelClass: ['snack-background-green'],
        verticalPosition: 'top',
        horizontalPosition: 'end',
      }
    );
  }

  deleteNode(nodeID) {
    this.dialogsService
      .confirm('Please Confirm Deletion', 'Are you sure you want to delete ' + nodeID + '?')
      .subscribe(res => {
        if (res) {
          this.dataService.getServerList()
            .subscribe(servers => {
              this.dataService.deletePod(servers[0].serverIp, nodeID)
                .subscribe((deleteRes: any) => {
                  if (deleteRes) {
                    this.snackBar.open(
                      'Termination of ' + nodeID + ' scheduled successfully.',
                      "X",
                      {
                        announcementMessage: "test",
                        duration: 7000,
                        panelClass: ['snack-background-green'],
                        verticalPosition: 'top',
                        horizontalPosition: 'end',
                      }
                    );
                    //
                    //setTimeout(this.refresh(this.refreshTime), 30000);
                  }
                })
            })
        }
      });
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
  'outOfDiskReason': string;
  'outOfDiskStatus': string;
  'outOfDiskType': string;
  'memoryPressureReason': string;
  'memoryPressureStatus': string;
  'memoryPressureType': string;
  'diskPressureReason': string;
  'diskPressureStatus': string;
  'diskPressureType': string;
}



export class ExampleDataSource extends DataSource<any> {

  connect(): Observable<Element[]> {
    return Observable.of(allPodDetails);
  }

  disconnect() { }
}
/*
@Component({
  selector: 'dialog-data-example-dialog',
  templateUrl: 'dialog-data-example-dialog.html',
})
*/
export class DialogDataExampleDialog {
  constructor(public dialogRef: MatDialogRef<DialogDataExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

let InternalIP, Hostname, nodeRole, OS, Arch, podCIDR, nodeStatus, podColor, buttons: string, outOfDisk;
let outOfDiskReason, outOfDiskStatus, outOfDiskType,
  memoryPressureReason, memoryPressureStatus, memoryPressureType,
  diskPressureReason, diskPressureStatus, diskPressureType;
let allPodDetails: Element[] = [];
let interval;
