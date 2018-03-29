import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { MainMenuComponent } from './main-menu/main-menu.component';
import { ConfigComponent } from './config/config.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NodesComponent } from './nodes/nodes.component';
import { PodsComponent } from './pods/pods.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  {
    path: 'main',
    component: MainMenuComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'nodes',
    component: NodesComponent
  },
  {
    path: 'pods',
    component: PodsComponent
  },
  {
    path: 'config',
    component: ConfigComponent
  },
];


@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot( routes, { useHash: true } ),
  ],
  providers: [  ],
  declarations: [ ],
  exports: [
    RouterModule
  ],
})

export class AppRoutingModule {}
