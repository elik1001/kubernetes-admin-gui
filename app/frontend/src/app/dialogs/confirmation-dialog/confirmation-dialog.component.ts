import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent {
  public confirmTitle: string;
  public confirmMessage: string;

  constructor(public dialogRef:MatDialogRef<ConfirmationDialogComponent>) { }

}
