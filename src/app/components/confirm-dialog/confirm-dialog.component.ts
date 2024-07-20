import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatToolbarModule,
    MatDialogClose,
    MatButtonModule
  ],
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  title!: string;
  message!: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  closeDialog() {
    this.dialogRef.close(false);
  }
}
