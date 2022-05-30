import {Component, NgIterable, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {Test} from "../Model/test";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

import {SearchService} from "../Service/search.service";
import {Cities} from "../Model/cities";
import {Router} from "@angular/router";
import {stringify} from "@angular/compiler/src/util";
import {FlixbusService} from "../Service/flixbus.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [DatePipe]
})
export class SearchComponent implements OnInit {
  // @ts-ignore
// @ts-ignore
  type = "1";
  calsscalendar = "_3fBZP calendarlarge";
  displayC2 = "display: none;";
  hidden = "display: none;";
  testcarte = false;
  classimg = "imgaccueil"

  listcities: Array<Cities> = [];
  lists: any[] = [];

  minDate: Date;
  maxDate: Date;
  formGroup = this.fb.group({
      // tslint:disable-next-line:max-line-length
      Depart: ['Paris', [Validators.required]],
      Destination: ['Lyon', [Validators.required]],
      dateFrom: [new Date(), [Validators.required]],
      toDate: [new Date(), [Validators.required]],
      Adult: [1,],
      Children: [0,],
      Bikes: [0,],


    },
  );
  currentDate = new Date();
  c: Cities = new Cities;
  resultss: any[] = [];
  results: Cities[] = [];
  searchResults: any[] = ["ahmed", "yazid", "jalel", "nnnnn"];
  r1: boolean = true;
  r2: boolean = false;
  dispimg: boolean = false;

  constructor(public flixbusService: FlixbusService, private fb: FormBuilder, private searchService: SearchService, private router: Router) {

    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);
  }

  get Depart() {
    return this.formGroup.get('Depart');
  }

  get Destination() {
    return this.formGroup.get('Destination');
  }

  get Adult() {
    return this.formGroup.get('Adult');
  }

  get Children() {
    return this.formGroup.get('Children');
  }

  get Bikes() {
    return this.formGroup.get('Bikes');
  }

  get dateFrom() {
    return this.formGroup.get('dateFrom');
  }
  get Todate() {
    return this.formGroup.get('toDate');
  }

  switchText() {
    let aux = this.formGroup.get('Depart')?.value;
    this.formGroup.get('Depart')?.setValue(this.formGroup.get('Destination')?.value);
    this.formGroup.get('Destination')?.setValue(aux);

  }

  affichecarte() {
    if (this.testcarte == false) {
      this.hidden = "";
      this.testcarte = true;
    } else {
      this.hidden = "display: none;";
      this.testcarte = false;
    }
  }

  setType(test: number) {
    if (test == 2) {

      this.calsscalendar = "_3fBZP calendarsmall";
      console.log(this.calsscalendar);
      this.r2 = true
      this.r1 = false
      this.displayC2 = "";

    } else {
      this.calsscalendar = "_3fBZP calendarlarge";
      this.r1 = true
      this.r2 = false
      console.log(this.calsscalendar);
      this.displayC2 = "display: none;"
    }
    return this.type = String(test);
  }

  clearDepart() {
    this.formGroup.get('Depart')?.setValue("");
  }

  clearDestination() {
    this.formGroup.get('Destination')?.setValue("");
  }

  setDepart() {
    if (this.formGroup.get('Depart')?.valid == false || this.results.length == 0) {
      this.formGroup.get('Depart')?.setValue("Paris");
    }
  }

  setDestination() {
    if (this.formGroup.get('Destination')?.valid == false || this.results.length == 0) {
      this.formGroup.get('Destination')?.setValue("Lyon");
    }
  }

  Add(id: number) {
    if (id == 1) {
      this.formGroup.get('Adult')?.setValue(this.formGroup.get('Adult')?.value + 1)
    } else if (id == 2) {
      this.formGroup.get('Children')?.setValue(this.formGroup.get('Children')?.value + 1)
    } else if (id == 3) {
      this.formGroup.get('Bikes')?.setValue(this.formGroup.get('Bikes')?.value + 1)
    }
  }

  Remove(id: number) {
    if (id == 1 && this.Adult?.value != 1) {
      this.formGroup.get('Adult')?.setValue(this.formGroup.get('Adult')?.value - 1)
    } else if (id == 2 && this.Children?.value != 0) {
      this.formGroup.get('Children')?.setValue(this.formGroup.get('Children')?.value - 1)
    } else if (id == 3 && this.Bikes?.value != 0) {
      this.formGroup.get('Bikes')?.setValue(this.formGroup.get('Bikes')?.value - 1)
    }
  }

  addC(c: Cities) {
    this.listcities.push.apply(c);
    console.log(this.listcities);
  }

  async getallC() {
    var l: Array<Cities> = [];
    var tr = this.searchService.getAllCities();
    tr.forEach(obj => {
      Object.entries(obj.cities).map(t => {
        // @ts-ignore
        this.c.id = Number(t[1].id);

        // @ts-ignore
        this.c.name = t[1].name;
        //   console.log(this.c);
        l.push(this.c);


      })


      console.log('-------------------');
    });

    // @ts-ignore
    await new Promise(f => setTimeout(f, 10000));
    console.log(l);
    return l;
  }

  searchOnKeyUp(event: KeyboardEvent) {// @ts-ignore

    let input = event.target.value;
    console.log(this.results);
    this.results = this.searchFromArray(this.listcities, input);
    //console.log('event.target.value: ' + input);
    //console.log('this.searchResults: ' + this.searchResults);
    if (input.length > 0) {
      this.results = this.searchFromArray(this.listcities, input);
    }
  }

  searchFromArray(arr: string | any[], regex: any) {
    let matches: Cities[] = [], i;
    for (i = 0; i < arr.length; i++) {

      if (arr[i].name.toLowerCase().match(regex.toLowerCase())) {
        matches.push(arr[i]);
      }
    }
//    console.log('matches: ' + matches);
    return matches;
  }

  loadrs() {
    this.results = this.searchFromArray(this.listcities, "");
  }

  displayFn(c: Cities): String {
    return c && c.name ? c.name : '';
  }

  ngOnInit() {

    this.flixbusService.authenticate();
    if (this.router.url == "/list") {

      console.log("statu",localStorage.getItem("statu"))
      if(localStorage.getItem("statu")=="Back")
      { console.log("e9leb")
        this.Depart.setValue(localStorage.getItem("destination"))
        this.Destination.setValue(localStorage.getItem("depart"))


      }else
      {
        this.Depart.setValue(localStorage.getItem("depart"))
        this.Destination.setValue(localStorage.getItem("destination"))
      }

      this.Todate.setValue(new Date(localStorage.getItem("toDate")))

      this.dispimg = true
      this.classimg = "imglist"

      this.Adult.setValue(Number(localStorage.getItem("adult")))
      this.Children.setValue(Number(localStorage.getItem("children")))
      this.Bikes.setValue(Number(localStorage.getItem("bikes")))
      this.dateFrom.setValue(new Date(localStorage.getItem("datefrom")))
      this.setType(Number(localStorage.getItem("radio")))

    }else {
      localStorage.clear();
    }


    let arrayTemp: Cities[] = [];
    this.searchService.getAllCities().subscribe(data => {
        console.log("test start2");
        this.results = data.cities;
        for (var i in data.cities) {
          let ccs: Cities = new Cities();
          //  console.log(data.cities[i].id);
          // @ts-ignore
          ccs.id = Number(data.cities[i].id);
          //  console.log(data.cities[i].name);
          // @ts-ignore
          ccs.name = data.cities[i].name;

          arrayTemp.push(ccs);


        }


      }, error => console.log(error),
      () => console.log('Done'));
    this.listcities = arrayTemp;
    this.lists = arrayTemp;


  }

  getId(list: Cities[], name: string) {
    let i, rs;
    rs = -1;
    for (i = 0; i < list.length; i++) {

      if (list[i].name.toLowerCase() == (name.toLowerCase())) {
        rs = list[i].id;
      }

    }
    return rs;

  }

  onSubmit() {
    console.log("onsubmit")
    let test = this.searchService.SearchTrip(this.getId(this.lists, this.Depart.value), this.getId(this.lists, this.Destination.value), this.getdate(), this.Adult.value, this.Children.value, this.Bikes.value).subscribe
    (
      (data) => {
        console.log("done");
        localStorage.setItem('departId', this.getId(this.lists, this.Depart.value));
        localStorage.setItem('destinationId', this.getId(this.lists, this.Destination.value));
        localStorage.setItem("adult", this.Adult.value);
        localStorage.setItem("children", this.Children.value);
        localStorage.setItem('bikes', this.Bikes.value)
        localStorage.setItem('depart', this.Depart.value);
        localStorage.setItem('destination', this.Destination.value)
        localStorage.setItem('datefrom', this.dateFrom.value)
        localStorage.setItem('toDate', this.Todate.value)
        localStorage.setItem('radio', this.type)
        for(var i=1;i<(data['trips'].length);i++) {
         for(var j=0;j<(data['trips'][i]['items'].length);j++) {
          data['trips'][0]['items'].push(data['trips'][i]['items'][j])

          }

        }

        localStorage.setItem("data", JSON.stringify(data));
        console.log(data)
        if(this.type=="2")
        { localStorage.setItem('toDate', this.Todate.value)
          localStorage.setItem("statu","Go")
        }
        if (this.router.url == "/list")
        window.location.reload();
        else
        {


          this.router.navigate(['/list'], {state: data});
        }


        console.log("dattaaaaa",data);
      },
      (error) => console.log(error)
    );
    /*
       let citiefrom: Cities[] = [];
       let DestinationCities: Cities[] = [];
       let object: {
         search_by: string; from: number; to: number;
         departure_date: Date; adult: number; children: number; bikes: number
       };
       // @ts-ignore
       citiefrom = this.searchFromArray(this.lists, this.formGroup.get('Depart').value);
       console.log("fromaa" + this.formGroup.get('Depart')?.value);
       // @ts-ignore
       DestinationCities = this.searchFromArray(this.lists, this.formGroup.get('Destination').value);
       // console.log(this.lists);
       console.log("from" + this.getId(this.lists, this.formGroup.get('Depart')?.value));
       console.log("to" + this.getId(this.lists, this.formGroup.get('Destination')?.value));
     //  console.log(this.searchService.SearchTrip(this.getId(this.lists, this.formGroup.get('Depart')?.value), this.getId(this.lists, this.formGroup.get('Destination')?.value)));
       let test = this.searchService.SearchTrip(this.getId(this.lists, this.Depart.value), this.getId(this.lists, this.Destination.value),this.Adult.value,this.dateFrom.value,this.Children.value,this.Bikes.value).subscribe
       (
         (data) => {
           console.log("done");
           console.log(data);
         },
         (error) => console.log(error)
       );
       /*object = {
             search_by: "cities",
             from: citiefrom[0].id,
             to: DestinationCities[0].id,
             departure_date:this.formGroup.get('dateFrom')?.value,
         adult:this.formGroup.get('Adult')?.value,
         children:this.formGroup.get('Children')?.value,
         bikes:this.formGroup.get('Bikes')?.value,
           };
           const json = JSON.stringify(object);
         */  /*this..adduser(json).subscribe
      (
        (data) => {
          console.log("done");
        },
        (error) => console.log(error)
      );
      console.log(json);
    } else {
    console.log("error");
    }*/
  }

  getdate() {
    let date;
    let dateValue;
    date = this.formGroup.get('dateFrom').value;
    date.day;


    let month = "x";
    if ((date.getMonth() + 1) < 10) {
      month = "0" + (date.getMonth() + 1);

    } else
      month = (date.getMonth() + 1)
    dateValue = date.getDate() + '.' + month + '.' + date.getFullYear()
    return dateValue;
  }
}
