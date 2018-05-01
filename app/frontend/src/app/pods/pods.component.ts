import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy, Inject } from '@angular/core';
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
  selector: 'app-pods',
  templateUrl: './pods.component.html',
  styleUrls: ['./pods.component.css'],
  animations: [
    trigger('detailExpand', [
      state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class PodsComponent implements OnDestroy, OnInit {

  dialogRef: MatDialogRef<ConfirmationDialogComponent>;
  serverList: Server[] = [];
  refreshTime = 0;

  displayedColumns = ['id', 'fullNodeName', 'podName', 'hostIP', 'podIP', 'nodeName', 'podNamespace', 'podStatus', 'buttons'];
  dataSource: MatTableDataSource<Element>;
  isExpansionDetailRow = (index, row) => row.hasOwnProperty('detailRow');

  public expandIcon = 'keyboard_arrow_right';
  private openedRow: CdkDetailRowDirective;

  onToggleChange(cdkDetailRow: CdkDetailRowDirective): void {
    let singleChildRowDetail = true;
    if (singleChildRowDetail && this.openedRow && this.openedRow.expended) {
      this.openedRow.toggle();
    }
    this.openedRow = cdkDetailRow.expended ? cdkDetailRow : undefined;
    if (this.openedRow && this.openedRow.expended) {
      cdkDetailRow.vcRef.element.nativeElement.childNodes[1].childNodes[1].childNodes["0"].nodeValue = 'keyboard_arrow_down';
    } else {
      cdkDetailRow.vcRef.element.nativeElement.childNodes[1].childNodes[1].childNodes["0"].nodeValue = 'keyboard_arrow_right';
    }
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    public state: MenuStateService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private dataService: DataService,
    private ref: ChangeDetectorRef,
    private dialogsService: DialogsService,
  ) { }

  getData() {
    this.dataService.getServerList()
      .subscribe(servers => {
        this.dataService.getKubePodList(servers[0].serverIp)
          .subscribe(pods => {
            //console.log(pods['items']);
            for (let i = 0; i < pods['items'].length; i++) {
              if (typeof pods['items'][i].status.conditions != 'undefined') {
                podName = pods['items'][i].status.containerStatuses[0].name;
                podImageName = pods['items'][i].status.containerStatuses[0].image;
                podContainerID = pods['items'][i].status.containerStatuses[0].containerID;
                podImageID = pods['items'][i].status.containerStatuses[0].imageID;
                podRestartCount = pods['items'][i].status.containerStatuses[0].restartCount;
                //console.log(pods['items'][i]);
                if (pods['items'][i].status.conditions[1].status === "False") {
                  podColor = "red";
                  podStatus = "False"
                } else if (pods['items'][i].status.conditions[1].status === "True") {
                  podColor = "green";
                  podStatus = "True";
                } else {
                  podColor = "orange";
                  podStatus = "Unavailable"
                }
              } else {
                podColor = "brown";
                podStatus = "Undefined";
                podName = "Undefined";
              }

              allPodDetails[i] = {
                "id": i + 1,
                "fullNodeName": pods['items'][i].metadata.name,
                "hostIP": pods['items'][i].status.hostIP,
                "podIP": pods['items'][i].status.podIP,
                "podStatus": podStatus,
                "podName": podName,
                "nodeName": pods['items'][i].spec.nodeName,
                "podNamespace": pods['items'][i].metadata.namespace,
                "color": podColor,
                "podImageName": podImageName,
                "podContainerID": podContainerID,
                "podImageID": podImageID,
                "podRestartCount": podRestartCount,
                "podPhase": pods['items'][i].status.phase,
              }

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
    this.getData();
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

  podEdit(podID) {
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

  deletePod(podID) {
    this.dialogsService
      .confirm('Please Confirm Deletion', 'Are you sure you want to delete ' + podID + '?')
      .subscribe(res => {
        if (res) {
          this.dataService.getServerList()
            .subscribe(servers => {
              this.dataService.deletePod(servers[0].serverIp, podID)
                .subscribe((deleteRes: any) => {
                  if (deleteRes) {
                    this.snackBar.open(
                      'Termination of ' + podID + ' scheduled successfully.',
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
  id: number;
  fullNodeName: string;
  podName: string;
  hostIP: string;
  podIP: string;
  nodeName: string;
  podNamespace: string;
  podStatus: string;
  color: string;
  podImageName: string;
  podContainerID: string;
  podImageID: string;
  podRestartCount: string;
  podPhase: string;
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

let podColor: string;
let allPodDetails: Element[] = [];
let interval;
let podStatus;
let podName;
let podImageName;
let podContainerID;
let podImageID;
let podRestartCount;
let podPhase;
