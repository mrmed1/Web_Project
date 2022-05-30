import {Component, OnInit} from '@angular/core';
import {FlixbusService} from "../Service/flixbus.service";
import {MatDialogRef} from "@angular/material/dialog";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Router} from "@angular/router";
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
              private store: AngularFirestore,
              private  router: Router,
              private spinner: NgxSpinnerService
             ) {
  }

  ngOnInit(): void {
    this.show = true;
    this.isShow = false;
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
    this.spinner.show();

    this.flixbusService.startpaiement();
    if (Number(localStorage.getItem("radio")) == 2) {
      this.store.firestore.collection('Data')
        .doc("eOsG51z63gg3zmL9zp8W").onSnapshot(val => {
        if(val.data().download_hash1 != '' && val.data().order_id1 !='') {
          this.flixbusService.getTicket1(val.data().download_hash1, val.data().order_id1).subscribe(
            (value: any) => {
              console.log(value)
              /* console.log("reservation")
               this.isShow = true;
               this.show = false;
               localStorage.setItem("invoice_link",value.body["order"]["invoice_link"])
               localStorage.setItem("reminder_link",value.body["order"]["reminder_link"])
               // this.spinner.hide()*/
            }, error => {
              this.spinner.hide();
              this.isShow = true;
              this.show = false;
              localStorage.setItem("invoice_link1", error.error.order.invoice_link)

            }
          )
        }
        //  console.log(this.x)
      });
      this.store.firestore.collection('Data')
        .doc("eOsG51z63gg3zmL9zp8W").onSnapshot(val => {
        if(val.data().download_hash2 != '' && val.data().order_id2 !='') {
          this.flixbusService.getTicket2(val.data().download_hash2, val.data().order_id2).subscribe(
            (value: any) => {
              console.log(value)
              /* console.log("reservation")
               this.isShow = true;
               this.show = false;
               localStorage.setItem("invoice_link",value.body["order"]["invoice_link"])
               localStorage.setItem("reminder_link",value.body["order"]["reminder_link"])
               // this.spinner.hide()*/
            }, error => {
              this.isShow = true;
              this.show = false;
              localStorage.setItem("invoice_link2", error.error.order.invoice_link)

            }
          )
        }
        //  console.log(this.x)
      });
    }
    else{   this.spinner.show();
      this.store.firestore.collection('Data')
        .doc("eOsG51z63gg3zmL9zp8W").onSnapshot(val => {
      if(val.data().download_hash != '' && val.data().order_id !='') {


        this.flixbusService.getTicket(val.data().download_hash,val.data().order_id).subscribe(
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
            this.spinner.hide();
            localStorage.setItem("invoice_link",error.error.order.invoice_link)
            console.log(error.code)
            console.log(error.error.code)
            console.log(error.error.order.invoice_link)
            console.log(error.order)
            console.log(error.order.invoice_link)
          }
        )
      }
        //  console.log(this.x)
      });

    }

  }

  cleanfirebase() {
    this.store.collection('Data').doc('eOsG51z63gg3zmL9zp8W').update({download_hash: "",order_id:"",download_hash1: "",order_id1:"",download_hash2: "",order_id2:""}).then(
      data => {
        console.log(data)
      })
    localStorage.clear();
    this.dialogRef.close();
    this.router.navigateByUrl("");


  }
}
