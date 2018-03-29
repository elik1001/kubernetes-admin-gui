import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MaterialModule } from './material.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SideNavMenuModule } from 'mat-sidenav-menu';

import { DashboardComponent } from './dashboard/dashboard.component';
import { MenuStateService } from './menu-state-service';
import { DataService } from './data.service'
import { MainMenuComponent } from './main-menu/main-menu.component';
import { ConfigComponent } from './config/config.component';
import { NodesComponent } from './nodes/nodes.component';
import { PodsComponent } from './pods/pods.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MainMenuComponent,
    ConfigComponent,
    NodesComponent,
    PodsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    MaterialModule,
    FlexLayoutModule,
    SideNavMenuModule,
    AppRoutingModule
  ],
  providers: [
    MenuStateService,
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
