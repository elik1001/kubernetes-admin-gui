import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MaterialModule } from './material.module';
import { DialogsModule } from './dialogs/dialogs.modules';

//add
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { BidiModule } from '@angular/cdk/bidi';
import { ObserversModule } from '@angular/cdk/observers';
import { OverlayModule } from '@angular/cdk/overlay';
import { PlatformModule } from '@angular/cdk/platform';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkDetailRowDirective} from './cdk-detail-row.directive';
//end add

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
    PodsComponent,
    CdkDetailRowDirective
  ],
  exports: [
    // CDK
    A11yModule,
    BidiModule,
    ObserversModule,
    OverlayModule,
    PlatformModule,
    PortalModule,
    ScrollDispatchModule,
    CdkStepperModule,
    CdkTableModule
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    MaterialModule,
    FlexLayoutModule,
    SideNavMenuModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DialogsModule
  ],
  providers: [
    MenuStateService,
    DataService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
