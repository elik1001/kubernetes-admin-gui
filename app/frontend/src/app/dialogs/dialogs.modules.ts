import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { DialogsService } from './dialogs.service';
import { MatButtonModule, MatDialogModule } from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
  ],
  declarations: [ConfirmationDialogComponent],
  exports: [ConfirmationDialogComponent],
  entryComponents: [ConfirmationDialogComponent],
  providers: [DialogsService]
})
export class DialogsModule { }
