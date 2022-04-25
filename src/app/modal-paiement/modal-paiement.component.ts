import {Component, OnInit} from '@angular/core';
import {FlixbusService} from "../Service/flixbus.service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-modal-paiement',
  templateUrl: './modal-paiement.component.html',
  styleUrls: ['./modal-paiement.component.css']
})
export class ModalPaiementComponent implements OnInit {


  constructor(public flixbusService: FlixbusService,
              public dialogRef: MatDialogRef<ModalPaiementComponent>,) {
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
  }
}
