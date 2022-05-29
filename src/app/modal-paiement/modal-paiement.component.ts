import {Component, OnInit} from '@angular/core';
import {FlixbusService} from "../Service/flixbus.service";
import {MatDialogRef} from "@angular/material/dialog";


@Component({
  selector: 'app-modal-paiement',
  templateUrl: './modal-paiement.component.html',
  styleUrls: ['./modal-paiement.component.css']
})
export class ModalPaiementComponent implements OnInit {
  show: boolean = true;
  isShow: boolean = false;

  constructor(public flixbusService: FlixbusService,
              public dialogRef: MatDialogRef<ModalPaiementComponent>
             ) {
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


    this.flixbusService.startpaiement();
    if (Number(localStorage.getItem("radio")) == 2) {
      this.flixbusService.getTicket1().subscribe(
        (value:any) => {
          console.log("reservation")
          if(value.response == 503)
          {
            /*this.isShow = true;
            this.show = false;
            localStorage.setItem("invoice_link1",value.body["order"]["invoice_link"])*/
            //localStorage.setItem("reminder_link1",value["order"]["reminder_link"])
            // this.spinner.hide()
          }
    else {
            /*this.isShow = true;
            this.show = false;
            localStorage.setItem("invoice_link1",value.body["order"]["invoice_link"])
           localStorage.setItem("reminder_link1",value["order"]["reminder_link"])*/
            // this.spinner.hide()
          }

        }
      )
      this.flixbusService.getTicket2().subscribe(
        (value:any) => {
          console.log("reservation")
          if(value.response == 503)
          {
            this.isShow = true;
            this.show = false;
            localStorage.setItem("invoice_link2",value.body["order"]["invoice_link"])
            //localStorage.setItem("reminder_link1",value["order"]["reminder_link"])
            // this.spinner.hide()
          }
          else {
            this.isShow = true;
            this.show = false;
            localStorage.setItem("invoice_link2",value.body["order"]["invoice_link"])
            localStorage.setItem("reminder_link2",value["order"]["reminder_link"])
            // this.spinner.hide()
          }
        }
      )
    }
    else{
      this.flixbusService.getTicket().subscribe(
        (value:any) => {
          console.log(value)
         /* console.log("reservation")
          this.isShow = true;
          this.show = false;
          localStorage.setItem("invoice_link",value.body["order"]["invoice_link"])
          localStorage.setItem("reminder_link",value.body["order"]["reminder_link"])
          // this.spinner.hide()*/
        },error => {
          this.isShow = true;
          this.show = false;
        localStorage.setItem("invoice_link",error.error.order.invoice_link)
          console.log(error.code)
          console.log(error.error.code)
          console.log(error.error.order.invoice_link)
          console.log(error.order)
          console.log(error.order.invoice_link)
        }
      )
    }

  }
}
