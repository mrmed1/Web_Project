import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {FlixbusService} from "../Service/flixbus.service";
import {stringify} from "@angular/compiler/src/util";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ModalPaiementComponent} from "../modal-paiement/modal-paiement.component";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  animations: [
    trigger('widthGrow', [
      state(
        'closed',
        style({
          height: 0,
        })
      ),
      state(
        'open',
        style({
          height: 285,
        })
      ),
      transition('* => *', animate(400)),
    ]),
  ],
})
export class CheckoutComponent implements OnInit {

  numbers =3;
  state = 'closed';
  hide = true;
  person : any = []
  bagage = 0;
  formGroup !: FormGroup;
  items: FormArray | undefined;
  constructor(public flixbusService:FlixbusService,
              private fb:FormBuilder,
              private dialog: MatDialog,
              private spinner: NgxSpinnerService) { }






  /* createItem() {
     return this.fb.group({
       prenom: '',
       nom: ''
     });
  }*/

 /* get formData() {
    return <FormArray>this.formGroup.get("items");
  }*/





  ngOnInit(): void {

    /*this.formGroup = this.fb.group({

      items: this.fb.array([this.createItem()]),

    });*/
    localStorage.setItem("uid","direct:169396943:1:10")
    localStorage.setItem("adult", "1")
    localStorage.setItem("children", "1")
    localStorage.setItem("bikes", "0")
    this.flixbusService.authenticate();

    this.flixbusService.createReservation(String(localStorage.getItem("uid")),this.num(localStorage.getItem("children")),0,this.num(localStorage.getItem("adult")));

    this.flixbusService.getancillary();
    console.log("passengers: ", this.flixbusService.tabpassenger)

  }



  changeState(): void {
    this.hide ? (this.hide = false) : (this.hide = true);
    this.state == 'closed' ? (this.state = 'open') : (this.state = 'closed');
  }

  add() {

  if (this.bagage >= 0)
    this.bagage ++
  }
  remove() {

    if (this.bagage > 0)
      this.bagage --
    else
      this.bagage = 0
  }

  num(s: string | null) {
    return Number(s)
  }
  public localStorageItem(id: string): string {
    return <string>localStorage.getItem(id);
  }
  counter(i: number) {
    return new Array(i);
  }

  onSubmit() {
    this.spinner.show();
    let i;
    let x = [];

    if (this.num(localStorage.getItem("adult")) > 0) {
      for (i = 1; i <= this.num(localStorage.getItem("adult")); i++) {

        x.push({
          "firstname": document.getElementById("prenom" + i)["value"],
          "lastname": document.getElementById("nom" + i)["value"],
          "phone": document.getElementById("tel")["value"],
          "type" : this.flixbusService.tabpassenger[i-1]["passenger"]["type"],
          "reference_id" : this.flixbusService.tabpassenger[i-1]["passenger"]["reference_id"],
        })
      }

    }
    if(this.num(localStorage.getItem("adult")) > 0 && this.num(localStorage.getItem("children")) > 0){
      for (let j = i; j <= (i-1) + this.num(localStorage.getItem("children")); j++) {
        x.push({
          "firstname": document.getElementById("prenom" + j)["value"],
          "lastname": document.getElementById("nom" + j)["value"],
          "phone": document.getElementById("tel")["value"],
          "birthdate": document.getElementById("datenaissance" + j)["value"].replaceAll("/","."),
          "type" : this.flixbusService.tabpassenger[j-1]["passenger"]["type"],
          "reference_id" : this.flixbusService.tabpassenger[j-1]["passenger"]["reference_id"],
        })
      }
      //this.flixbusService.addpassengertoreservation(x);
    this.flixbusService.addpassengertoreservation(x).subscribe(
        (data:any) => {
          console.log(data.body);
            localStorage.setItem("email",document.getElementById("email")["value"]);
            this.spinner.hide();
            this.openDialog();
        },
        error => console.log(error)
      )
    }

  }

  openDialog()
  {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = '70%';
    dialogConfig.minWidth = '30%';
    dialogConfig.panelClass = "marg";

    this.dialog.open(ModalPaiementComponent, dialogConfig).afterClosed().subscribe(
      result => {

      }
    );
  }
}
