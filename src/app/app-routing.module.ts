import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CheckoutComponent} from "./checkout/checkout.component";
import {SearchComponent} from "./search/search.component";
import {ListVoyageComponent} from "./list-voyage/list-voyage.component";

const routes: Routes = [
  {path: '', component:SearchComponent},
  { path: 'checkout', component: CheckoutComponent },
  { path: 'list', component: ListVoyageComponent }



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
