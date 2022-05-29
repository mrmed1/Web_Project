import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {SearchService} from "../Service/search.service";
import {FlixbusService} from "../Service/flixbus.service";
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr, 'fr');
@Component({
  selector: 'app-list-voyage',
  templateUrl: './list-voyage.component.html',
  styleUrls: ['./list-voyage.component.css']
})
export class ListVoyageComponent implements OnInit {
  list : any
  list2
  voyage2: boolean  = true;
  trip:any;
  priceTrip=0;
  departuretimestamp=0;
  arrivaltimestamp=0;
  departureStation="";
  arrivalStation="";
  durationH=0;
  durationM=0;
    constructor(public flixbusService:FlixbusService,private searchService: SearchService,private router : Router) { }

  ngOnInit(): void {
    localStorage.setItem("uid","0")
    if (localStorage.getItem("statu") == "Back")
    {
      this.voyage2 = false
      this.flixbusService.getTrip(localStorage.getItem("uid1")).subscribe(
        (data:any) => {


          console.log("daaaaaaaaaaaaatata",data.body.arrival)
          this.trip=data.body
          console.log("trip",this.trip);
          this.departuretimestamp=data.body['departure'].timestamp;
          this.arrivaltimestamp=data.body['arrival'].timestamp;
          this.departureStation=data.body['departure_station'].name;
          this.arrivalStation=data.body['arrival_station'].name;
          this.durationH=data.body['duration'].hour;
          this.durationM=data.body['duration'].minutes ;
          this.priceTrip=Number(localStorage.getItem("tripPrice"))


        },error => console.log(error)
      )

    }
    else
    {
      this.voyage2 = true

    }
    if(history.state.data == undefined)
    {
      this.list= JSON.parse(localStorage.getItem("data"));

      console.log(this.list)
    }
    else {
      this.list = history.state.data;console.log(this.list)
    }


  }

  tocheckout(uid,price) {

    if(localStorage.getItem("radio")=="1")
    { localStorage.setItem("uid",uid)
      this.router.navigateByUrl("/checkout")
    }
    else if(localStorage.getItem("statu")=="Go")
    {localStorage.setItem("uid1",uid)
      localStorage.setItem("tripPrice",price)
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
  clearTrip()
  {localStorage.setItem("statu","Go")
    this.searchService.SearchTrip(Number(localStorage.getItem("departId")),Number(localStorage.getItem("destinationId")), this.searchService.getdate(localStorage.getItem("datefrom")),Number( localStorage.getItem("adult")),Number(localStorage.getItem("children")),Number(localStorage.getItem("bikes"))).subscribe
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
}
