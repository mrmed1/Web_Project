import {Component, OnInit} from '@angular/core';
import {FlixbusService} from "../Service/flixbus.service";
import {MatDialogRef} from "@angular/material/dialog";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-modal-paiement',
  templateUrl: './modal-paiement.component.html',
  styleUrls: ['./modal-paiement.component.css']
})
export class ModalPaiementComponent implements OnInit {
  show: boolean = true;
  isShow: boolean = false;

  constructor(public flixbusService: FlixbusService,
              public dialogRef: MatDialogRef<ModalPaiementComponent>,
              private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
  }

  onClose() {
    this.dialogRef.close();
  }

  num(s: string | null) {
    return Number(s)
  }

  public localStorageItem(id: string): string {
    return <string>localStorage.getItem(id);
  }

  annuler() {

  }

  reserver() {

    this.spinner.show()
    this.flixbusService.startpaiement();
   this.flixbusService.getTicket().subscribe(
     (value:any) => {
       this.isShow = true;
       this.show = false;
       localStorage.setItem("invoice_link",value["order"]["invoice_link"])
       localStorage.setItem("reminder_link",value["order"]["reminder_link"])
       this.spinner.hide()
     }
   )
  }
}
