import { Component } from '@angular/core';
import { MenuStateService } from '../menu-state-service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent {

  constructor(public state: MenuStateService) { }

}
