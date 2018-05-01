import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';

@Injectable()
export class DialogsService {

    constructor(private dialog: MatDialog) { }

    public confirm(title: string, message: string): Observable<boolean> {

        let dialogRef: MatDialogRef<ConfirmationDialogComponent>;

        dialogRef = this.dialog.open(ConfirmationDialogComponent);

        dialogRef.componentInstance.confirmTitle = title;
        dialogRef.componentInstance.confirmMessage = message;

        return dialogRef.afterClosed();
    }
}
