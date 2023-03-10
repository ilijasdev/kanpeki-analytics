import { Component, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ContractsService } from "src/app/contracts.service";

@Component({
  selector: 'dialog-overview',
  templateUrl: 'dialog-overview.html',
  styleUrls: ['dialog.component.css']
})
export class DialogOverviewExampleDialog {
  allDeposits: any;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _mainService: ContractsService
  ) {}

  ngOnInit() {
    const allDeposits = this._mainService.getAllDepositTx();
    allDeposits.then(res => {
      console.log(res)
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
