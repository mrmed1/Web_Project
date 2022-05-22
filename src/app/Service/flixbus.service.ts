import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FlixbusService {
  tabancillary = [{}];
  tabpassenger = [{}];
  tabpassenger2 = [{}];
  nbrluggage = 0;
  urlv1: string;
  urlv2: string;
  from = "";
  to = "";
  departureTime: number | undefined;
  arrivalTime: number | undefined;
  from1 = "";
  to1 = "";
  departureTime1: number | undefined;
  arrivalTime1: number | undefined;
  from2 = "";
  to2 = "";
  departureTime2: number | undefined;
  arrivalTime2: number | undefined;

  total = 0;
  token: string
  trip :any;

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

  createReservation(uid1?: string, uid2?: string, children?: number, bikes?: number, adult?: number) {

    if (Number(localStorage.getItem("radio")) == 2) {
      const body1 = new HttpParams()
        .set('trip_uid', uid1)
        .set('children', children)
        .set('bikes', bikes)
        .set('adult', adult)
        .set('currency', "EUR")

       this.http.put(this.urlv1 + '/reservation/items.json',
        body1.toString(),
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
            localStorage.setItem('reservation_token1', data.body.cart.reservation.token)
            localStorage.setItem('id_reservation1', data.body.cart.reservation.id)
            this.arrivalTime1 = (data.body.cart.items[uid1].arrival.timestamp) * 1000;
            this.departureTime1 = (data.body.cart.items[uid1].departure.timestamp) * 1000;
            this.from1 = data.body.cart.items[uid1].from.name;
            this.to1 = data.body.cart.items[uid1].to.name;
            this.total += data.body.cart.price.total;
            this.getpassengerDetails();
          }


        },
        error => console.log(error)
      );
      const body2 = new HttpParams()
        .set('trip_uid', uid2)
        .set('children', children)
        .set('bikes', bikes)
        .set('adult', adult)
        .set('currency', "EUR")

      return this.http.put(this.urlv1 + '/reservation/items.json',
        body2.toString(),
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
            localStorage.setItem('reservation_token2', data.body.cart.reservation.token)
            localStorage.setItem('id_reservation2', data.body.cart.reservation.id)
            this.arrivalTime2 = (data.body.cart.items[uid2].arrival.timestamp) * 1000;
            this.departureTime2 = (data.body.cart.items[uid2].departure.timestamp) * 1000;
            this.from2 = data.body.cart.items[uid2].from.name;
            this.to2 = data.body.cart.items[uid2].to.name;
            this.total += data.body.cart.price.total;
            this.getpassengerDetails();
          }


        },
        error => console.log(error)
      );
    } else {
      const body = new HttpParams()
        .set('trip_uid', uid1)
        .set('children', children)
        .set('bikes', bikes)
        .set('adult', adult)
        .set('currency', "EUR")


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
            this.arrivalTime = (data.body.cart.items[uid1].arrival.timestamp) * 1000;
            this.departureTime = (data.body.cart.items[uid1].departure.timestamp) * 1000;
            this.from = data.body.cart.items[uid1].from.name;
            this.to = data.body.cart.items[uid1].to.name;
            this.total += data.body.cart.price.total;
             this.getpassengerDetails();
          }


        },
        error => console.log(error)
      );
    }


  }

  getancillary() {
    let token = localStorage.getItem('token')
    this.tabancillary.pop();
    if (Number(localStorage.getItem("radio")) == 2) {
       this.http.get(this.urlv2 + '/reservations/' + localStorage.getItem('id_reservation1') + '/ancillaries?reservation_token=' + localStorage.getItem('reservation_token1'),

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
        },
        error => console.log(error)
      );
       this.http.get(this.urlv2 + '/reservations/' + localStorage.getItem('id_reservation2') + '/ancillaries?reservation_token=' + localStorage.getItem('reservation_token2'),

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
        },
        error => console.log(error)
      );
    }
    else {
      if (Number(localStorage.getItem("radio")) == 2) {
        this.http.get(this.urlv2 + '/reservations/' + localStorage.getItem('id_reservation') + '/ancillaries?reservation_token=' + localStorage.getItem('reservation_token'),

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
          },
          error => console.log(error)
        );
      }

    }

  }

  getpassengerDetails() {
    this.tabpassenger.pop();
    this.tabpassenger2.pop();
    if (Number(localStorage.getItem("radio")) == 2) {
       this.http.get(this.urlv1 + "/reservations/" + localStorage.getItem('id_reservation1') + '/passengers.json?reservation_token=' + localStorage.getItem('reservation_token1'),
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
      this.http.get(this.urlv1 + "/reservations/" + localStorage.getItem('id_reservation2') + '/passengers.json?reservation_token=' + localStorage.getItem('reservation_token2'),
        {

          headers: new HttpHeaders()
            .set('X-API-Authentication', 'DEV_TEST_TOKEN_STAGING')
        }).subscribe(
        (data: any) => {
          console.log(data.trips)
          data.trips.forEach((val1: any) => {
            val1.passengers.forEach((val2: any) => {

              this.tabpassenger2.push({"passenger": {"reference_id": val2.reference_id, "type": val2.type}})

            })
          })
     //     console.log(this.tabpassenger)
          // console.log(data["trips"][0]["passengers"]);


        },
        error => console.log(error)
      );
    }else {
      this.http.get(this.urlv1 + "/reservations/" + localStorage.getItem('id_reservation') + '/passengers.json?reservation_token=' + localStorage.getItem('reservation_token'),
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

  }

  /*addpassengertoreservation(tab) {

    if (Number(localStorage.getItem("radio")) == 2) {
      this.http.put(this.urlv1 + '/reservations/' + localStorage.getItem("id_reservation2") + '/passengers.json',
        {
          'reservation_token': localStorage.getItem("reservation_token2"),
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
      return this.http.put(this.urlv1 + '/reservations/' + localStorage.getItem("id_reservation1") + '/passengers.json',
        {
          'reservation_token': localStorage.getItem("reservation_token1"),
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


    } else {

    }

  }*/
  addpassengertab1(tab1)
  {
    return this.http.put(this.urlv1 + '/reservations/' + localStorage.getItem("id_reservation1") + '/passengers.json',
      {
        'reservation_token': localStorage.getItem("reservation_token1"),
        'passengers': tab1
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
  addpassengertab2(tab2)
  {
    return this.http.put(this.urlv1 + '/reservations/' + localStorage.getItem("id_reservation2") + '/passengers.json',
      {
        'reservation_token': localStorage.getItem("reservation_token2"),
        'passengers': tab2
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
  addpassengertab(tab)
  {
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
    if (Number(localStorage.getItem("radio")) == 2) {
      const body1 = new HttpParams()
        .set('reservation', localStorage.getItem("id_reservation1"))
        .set('reservation_token', localStorage.getItem("reservation_token1"))
        .set('email', localStorage.getItem("email"))
        .set('payment[psp]', "offline")
        .set('payment[method]', "cash")

      console.log(body1.toString())
       this.http.post(this.urlv1 + "/payment/start.json", body1.toString(), {
        observe: 'response',
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Access-Control-Allow-Origin', '*')
          .set('X-API-Session', String(this.token))
          .set('X-API-Authentication', 'DEV_TEST_TOKEN_STAGING')
      }).subscribe(
        (data: any) => {
          if (data.status == 200) {
            localStorage.setItem("payment_id1", data.body.payment_id)
/*            setTimeout(() => this.finalyzepaiement(), 1500)*/


          }

        }
      )
      const body2 = new HttpParams()
        .set('reservation', localStorage.getItem("id_reservation2"))
        .set('reservation_token', localStorage.getItem("reservation_token2"))
        .set('email', localStorage.getItem("email"))
        .set('payment[psp]', "offline")
        .set('payment[method]', "cash")


       this.http.post(this.urlv1 + "/payment/start.json", body2.toString(), {
        observe: 'response',
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Access-Control-Allow-Origin', '*')
          .set('X-API-Session', String(this.token))
          .set('X-API-Authentication', 'DEV_TEST_TOKEN_STAGING')
      }).subscribe(
        (data: any) => {
          if (data.status == 200) {
            localStorage.setItem("payment_id2", data.body.payment_id)
            setTimeout(() => this.finalyzepaiement(), 1500)


          }

        }
      )
    }
    else {
      const body1 = new HttpParams()
        .set('reservation', localStorage.getItem("id_reservation"))
        .set('reservation_token', localStorage.getItem("reservation_token"))
        .set('email', localStorage.getItem("email"))
        .set('payment[psp]', "offline")
        .set('payment[method]', "cash")


       this.http.post(this.urlv1 + "/payment/start.json", body1.toString(), {
        observe: 'response',
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Access-Control-Allow-Origin', '*')
          .set('X-API-Session', String(this.token))
          .set('X-API-Authentication', 'DEV_TEST_TOKEN_STAGING')
      }).subscribe(
        (data: any) => {
          if (data.status == 200) {
            localStorage.setItem("payment_id", data.body.payment_id)
            setTimeout(() => this.finalyzepaiement(), 1500)


          }

        }
      )
    }


  }

  finalyzepaiement() {
    if (Number(localStorage.getItem("radio")) == 2) {
      const body1 = new HttpParams()
        .set('reservation', localStorage.getItem("id_reservation1"))
        .set('reservation_token', localStorage.getItem("reservation_token1"))
        .set('payment_id', localStorage.getItem("payment_id1"))

       this.http.put(this.urlv1 + "/payment/commit.json", body1.toString(), {
        observe: 'response',
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Access-Control-Allow-Origin', '*')
          .set('X-API-Session', String(this.token))
          .set('X-API-Authentication', 'DEV_TEST_TOKEN_STAGING')
      }).subscribe(
        (data: any) => {
          if (data.status == 200) {
            localStorage.setItem("download_hash1", data.body.download_hash)
            localStorage.setItem("order_id1", data.body.order_id)
           setTimeout(() => this.getTicket1(), 1500)
          }


        }, error => console.log(error)
      )
      const body2 = new HttpParams()
        .set('reservation', localStorage.getItem("id_reservation2"))
        .set('reservation_token', localStorage.getItem("reservation_token2"))
        .set('payment_id', localStorage.getItem("payment_id2"))

       this.http.put(this.urlv1 + "/payment/commit.json", body2.toString(), {
        observe: 'response',
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Access-Control-Allow-Origin', '*')
          .set('X-API-Session', String(this.token))
          .set('X-API-Authentication', 'DEV_TEST_TOKEN_STAGING')
      }).subscribe(
        (data: any) => {
          if (data.status == 200) {
            localStorage.setItem("download_hash2", data.body.download_hash)
            localStorage.setItem("order_id2", data.body.order_id)
            setTimeout(() => this.getTicket2(), 1500)
          }


        }, error => console.log(error)
      )
    }else {
      const body2 = new HttpParams()
        .set('reservation', localStorage.getItem("id_reservation"))
        .set('reservation_token', localStorage.getItem("reservation_token"))
        .set('payment_id', localStorage.getItem("payment_id"))

       this.http.put(this.urlv1 + "/payment/commit.json", body2.toString(), {
        observe: 'response',
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Access-Control-Allow-Origin', '*')
          .set('X-API-Session', String(this.token))
          .set('X-API-Authentication', 'DEV_TEST_TOKEN_STAGING')
      }).subscribe(
        (data: any) => {
          if (data.status == 200) {
            localStorage.setItem("download_hash", data.body.download_hash)
            localStorage.setItem("order_id", data.body.order_id)
            setTimeout(() => this.getTicket(), 1500)
          }


        }, error => console.log(error)
      )
    }

  }
  getTicket1()
  {
    return this.http.get(this.urlv2 + "/orders/" + localStorage.getItem("order_id1") + "/info.json?download_hash=" + localStorage.getItem('download_hash1'), {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Access-Control-Allow-Origin', '*')
        .set('X-API-Authentication', 'DEV_TEST_TOKEN_STAGING')
    })
  }
  getTicket2()
  {
    return this.http.get(this.urlv2 + "/orders/" + localStorage.getItem("order_id2") + "/info.json?download_hash=" + localStorage.getItem('download_hash2'), {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Access-Control-Allow-Origin', '*')
        .set('X-API-Authentication', 'DEV_TEST_TOKEN_STAGING')
    })
  }
  getTicket() {
    console.log(localStorage.getItem("order_id"))
    console.log(this.urlv2 + "/orders/" + localStorage.getItem("order_id") + "/info.json?download_hash=" + localStorage.getItem('download_hash'))

      return this.http.get(this.urlv2 + "/orders/" + localStorage.getItem("order_id") + "/info.json?download_hash=" + localStorage.getItem('download_hash'), {
        observe: 'response',
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Access-Control-Allow-Origin', '*')
          .set('X-API-Authentication', 'DEV_TEST_TOKEN_STAGING')
      })
    }



  getTrip(uid)
  {
    return this.http.get(this.urlv1 +"/trips/"+uid+"/info.json",{
      observe: 'response',
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Access-Control-Allow-Origin', '*')
        .set('X-API-Authentication', 'DEV_TEST_TOKEN_STAGING')
    })

  }

}
