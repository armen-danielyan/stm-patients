import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';

export interface IDialogData {
  title: string;
  text: string;
}

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {

  private static readonly CONFIRMED_DEFAULT = 0;

  private static readonly DIALOG_CONFIG = {
    position: { top: '140px'},
    role: 'dialog',
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogComponent>) {
  }

  static createModalAndGetResult({ title, text }: IDialogData, dialogService: MatDialog): Observable<boolean> {
    const config = Object.assign({}, this.DIALOG_CONFIG, {
      data: {
        confirmed: this.CONFIRMED_DEFAULT,
        title,
        text
      }
    });
    const dialogRef = dialogService.open(DialogComponent, config);

    return dialogRef.afterClosed().map(result => Boolean(result));
  }

  onNoClick(): void {
    this.dialogRef.close(this.data.confirmed);
  }

  confirmAction() {
    this.data.confirmed = 1;
    this.dialogRef.close(this.data.confirmed);
  }
}

