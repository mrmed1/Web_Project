import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Cities} from "../Model/cities";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  urlPath: string;
  constructor(private http: HttpClient) {
    this.urlPath = 'https://global.api-dev.flixbus.com/public/v1/network.json';
  }

  getAllCities():Observable<any>{
    let headers = new HttpHeaders();
    headers = headers.set('X-API-Authentication','DEV_TEST_TOKEN_STAGING');

    return  this.http.get('https://global.api-dev.flixbus.com/public/v1/network.json',{ headers:headers});

  }
  SearchTrip(idfrom: number,idTo:number,adults:number,children:number,bikes:number): Observable<any>
  {
    let headers = new HttpHeaders();
    headers = headers.set('X-API-Authentication','DEV_TEST_TOKEN_STAGING');
    console.log("https://global.api-dev.flixbus.com/public/v1/trip/search.json?search_by=cities&from="+idfrom+"&to="+idTo+"&departure_date=04.06.2022&adults=1&children=0&bikes=0");
    //return this.http.get('https://global.api-dev.flixbus.com/public/v1/trip/search.json?'+'search_by="cities&from='+idfrom+'&to='+idTo+'&departure_date=29.04.2022'+'&adults=1'+'&children=0'+'&bikes=0');
    return this.http.get('https://global.api-dev.flixbus.com/public/v1/trip/search.json?search_by=cities&from='+idfrom+'&to='+idTo+'&departure_date=04.06.2022&adult='+adults+'&children='+children+'&bikes='+bikes,{ headers:headers});

  }
}
