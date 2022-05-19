import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-list-voyage',
  templateUrl: './list-voyage.component.html',
  styleUrls: ['./list-voyage.component.css']
})
export class ListVoyageComponent implements OnInit {
  list : any
  list2
    constructor(private router : Router) { }

  ngOnInit(): void {
    localStorage.setItem("uid","0")

    if(history.state.data == undefined)
    {
      this.list= JSON.parse(localStorage.getItem("data"));

      console.log(this.list)
    }
    else {
      this.list = history.state.data;console.log(this.list)
    }


  }

  tocheckout(uid) {

    localStorage.setItem("uid",uid)

    this.router.navigateByUrl("/checkout")
  }
}
