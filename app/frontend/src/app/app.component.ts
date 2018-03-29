import { Component, OnInit } from '@angular/core';
import { MenuStateService } from './menu-state-service';

import { MatIconModule, MatIconRegistry } from '@angular/material';

import { Server } from './dbConfigs/kubeServerConfig';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    DataService,
    MatIconRegistry
  ]
})
export class AppComponent {
  title = 'app';
  serverList: Server[] = [];
  servStat: Number;

  public constructor(
    public matIconRegistry: MatIconRegistry,
    public dataService: DataService,
    public state: MenuStateService
  ) {
    matIconRegistry.registerFontClassAlias('fontawesome', 'fa');
   }

  menuDisabled() {
    this.state.menuDisabled();
  }

  ngOnInit() {
    this.menuDisabled();
  }

}
