import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FlixbusService {
  tabancillary = [{}];
  tabpassenger = [{}];
  nbrluggage = 0;
  urlv1: string;
  urlv2: string;
  from = "";
  to = "";
  departureTime: number | undefined;
  arrivalTime: number | undefined;
  total = 0;
  token: string

  constructor(private http: HttpClient) {
    this.urlv1 = "https://global.api-dev.flixbus.com/public/v1";
    this.urlv2 = "https://global.api-dev.flixbus.com/public/v2";
    this.token = localStorage.getItem('token')
  }


  authenticate() {
    const body = new HttpParams()
      .set('email', "DEV_TEST_STAGING@mail.com")
      .set('password', "DEV_TEST_STAGING")


    return this.http.post(this.urlv1 + '/partner/authenticate.json', body, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('X-API-Authentication', 'DEV_TEST_TOKEN_STAGING')


    }).subscribe(
      (data: any) => {

        console.log(data.token);
        localStorage.setItem("token", data.token);

      },
      error => console.log(error)
    );

  }

  createReservation(uid: string, children: number, bikes: number, adult: number) {


    const body = new HttpParams()
      .set('trip_uid', uid)
      .set('children', children)
      .set('bikes', bikes)
      .set('adult', adult)
      .set('currency', "EUR")

    /* .set('username', username)
 .set('password', password);*/


    return this.http.put(this.urlv1 + '/reservation/items.json',
      body.toString(),
      {
        observe: 'response',
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Access-Control-Allow-Origin', '*')
          .set('X-API-Session', String(this.token))
          .set('X-API-Authentication', 'DEV_TEST_TOKEN_STAGING')
      }
    ).subscribe(
      (data: any) => {
        if (data.status == 200) {
          localStorage.setItem('reservation_token', data.body.cart.reservation.token)
          localStorage.setItem('id_reservation', data.body.cart.reservation.id)
          this.arrivalTime = (data.body.cart.items[uid].arrival.timestamp) * 1000;
          this.departureTime = (data.body.cart.items[uid].departure.timestamp) * 1000;
          this.from = data.body.cart.items[uid].from.name;
          this.to = data.body.cart.items[uid].to.name;
          this.total = data.body.cart.price.total;
          this.getpassengerDetails();
        }


      },
      error => console.log(error)
    );
  }

  getancillary() {
    let token = localStorage.getItem('token')
    this.tabancillary.pop();
    return this.http.get(this.urlv2 + '/reservations/' + localStorage.getItem('id_reservation') + '/ancillaries?reservation_token=' + localStorage.getItem('reservation_token'),

      {

        headers: new HttpHeaders()
          .set('Access-Control-Allow-Origin', '*')
          .set('X-API-Session', String(token))
          .set('X-API-Authentication', 'DEV_TEST_TOKEN_STAGING')
      }
    ).subscribe(
      (data: any) => {

        data.forEach((val1: any) => {
          if (val1["product_type"] == 'luggage_additional') {
            this.nbrluggage += val1['max_available_count'];
            this.tabancillary.push(val1["ancillary_offer_reference_id"])
          }
        })
        /*

               foreach ($respdetailsreservation as $item) {
                if ($item['product_type'] == 'luggage_additional') {
                    $nbrluggage += $item['max_available_count'];

                    $tabancillary[] = $item['ancillary_offer_reference_id'];

                }
            }
         */

      },
      error => console.log(error)
    );
  }

  getpassengerDetails() {
    this.tabpassenger.pop();
    return this.http.get(this.urlv1 + "/reservations/" + localStorage.getItem('id_reservation') + '/passengers.json?reservation_token=' + localStorage.getItem('reservation_token'),
      {

        headers: new HttpHeaders()
          .set('X-API-Authentication', 'DEV_TEST_TOKEN_STAGING')
      }).subscribe(
      (data: any) => {
        console.log(data.trips)
        data.trips.forEach((val1: any) => {
          val1.passengers.forEach((val2: any) => {

            this.tabpassenger.push({"passenger": {"reference_id": val2.reference_id, "type": val2.type}})

          })
        })
        console.log(this.tabpassenger)
        // console.log(data["trips"][0]["passengers"]);


      },
      error => console.log(error)
    );
  }

  addpassengertoreservation(tab) {


    return this.http.put(this.urlv1 + '/reservations/' + localStorage.getItem("id_reservation") + '/passengers.json',
      {
        'reservation_token': localStorage.getItem("reservation_token"),
        'passengers': tab
      },
      {

        observe: 'response',
        headers: new HttpHeaders()

          .set('Access-Control-Allow-Origin', '*')
          .set('X-API-Session', String(this.token))
          .set('X-API-Authentication', 'DEV_TEST_TOKEN_STAGING')
      }
    )
  }

  startpaiement() {
    const body1 = new HttpParams()
      .set('reservation', localStorage.getItem("id_reservation"))
      .set('reservation_token', localStorage.getItem("reservation_token"))
      .set('email', localStorage.getItem("email"))
      .set('payment[psp]', "offline")
      .set('payment[method]', "cash")




    return this.http.post(this.urlv1 + "/payment/start.json", body1.toString(), {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Access-Control-Allow-Origin', '*')
        .set('X-API-Session', String(this.token))
        .set('X-API-Authentication', 'DEV_TEST_TOKEN_STAGING')
    }).subscribe(
      (data: any) => {
        if (data.status == 200)
        {
          localStorage.setItem("payment_id", data.body.payment_id)
          setTimeout(()=>this.finalyzepaiement(),1500)


        }

      }
    )
  }

  finalyzepaiement(){

    const body2 = new HttpParams()
      .set('reservation', localStorage.getItem("id_reservation"))
      .set('reservation_token', localStorage.getItem("reservation_token"))
      .set('payment_id', localStorage.getItem("payment_id"))

    return this.http.put(this.urlv1 + "/payment/commit.json", body2.toString(), {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Access-Control-Allow-Origin', '*')
        .set('X-API-Session', String(this.token))
        .set('X-API-Authentication', 'DEV_TEST_TOKEN_STAGING')
    }).subscribe(
      (data:any) => {
        if (data.status == 200)
        {
          localStorage.setItem("download_hash", data.body.download_hash)
          localStorage.setItem("order_id", data.body.order_id)
          setTimeout(()=>this.getTicket(),1500)
        }


      },error => console.log(error)
    )
  }
  getTicket(){
    return this.http.get(this.urlv2 + "/orders/" + localStorage.getItem("order_id") + "/info.json?download_hash=" + localStorage.getItem('download_hash'),{
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Access-Control-Allow-Origin', '*')
        .set('X-API-Session', String(this.token))
        .set('X-API-Authentication', 'DEV_TEST_TOKEN_STAGING')
    })
  }
}
