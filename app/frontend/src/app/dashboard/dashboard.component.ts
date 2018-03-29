import { Component } from '@angular/core';
//import { ActivatedRoute } from '@angular/router';
import { MenuStateService } from '../menu-state-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  constructor(public state: MenuStateService) { }

}
