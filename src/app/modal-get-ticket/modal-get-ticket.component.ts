import { Component, OnInit } from '@angular/core';
import {FlixbusService} from "../Service/flixbus.service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-modal-get-ticket',
  templateUrl: './modal-get-ticket.component.html',
  styleUrls: ['./modal-get-ticket.component.css']
})
export class ModalGetTicketComponent implements OnInit {
  show: boolean = true;
  isShow: boolean = false;
  constructor(public flixbusService: FlixbusService,
              public dialogRef: MatDialogRef<ModalGetTicketComponent>) { }

  ngOnInit(): void {
  }
  public localStorageItem(id: string): string {
    return <string>localStorage.getItem(id);
  }
  onClose() {
    this.dialogRef.close();
  }

  num(s: string | null) {
    return Number(s)
  }
}
