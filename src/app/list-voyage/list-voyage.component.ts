import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {SearchService} from "../Service/search.service";

@Component({
  selector: 'app-list-voyage',
  templateUrl: './list-voyage.component.html',
  styleUrls: ['./list-voyage.component.css']
})
export class ListVoyageComponent implements OnInit {
  list : any
  list2
    constructor(private searchService: SearchService,private router : Router) { }

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
    if(localStorage.getItem("type")=="1")
    { localStorage.setItem("uid",uid)
      this.router.navigateByUrl("/checkout")
    }
    else if(localStorage.getItem("statu")=="Go")
    {localStorage.setItem("uid1",uid)
      localStorage.setItem("statu","Back")
      this.searchService.SearchTrip(Number(localStorage.getItem("destinationId")),Number(localStorage.getItem("departId")), this.searchService.getdate(localStorage.getItem("toDate")),Number( localStorage.getItem("adult")),Number(localStorage.getItem("children")),Number(localStorage.getItem("bikes"))).subscribe
      (
        (data) => {
          console.log("done");

          localStorage.setItem("data", JSON.stringify(data));
          window.location.reload();
          console.log(data);
        },
        (error) => console.log(error)
      );
    }
    else {
      localStorage.setItem("uid2",uid)
      this.router.navigateByUrl("/checkout")
    }


  }
}
