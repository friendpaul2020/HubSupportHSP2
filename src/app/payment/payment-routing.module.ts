import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentPageComponent } from './pages/payment-page/payment-page.component';
import { PaymentSuccessComponent } from './components/payment-success/payment-success';
import { PaymentHistoryComponent } from './components/payment-history/payment-history';

const routes: Routes = [
  { path: '', component: PaymentPageComponent },
  { path: 'success', component: PaymentSuccessComponent },
  { path: 'history', component: PaymentHistoryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
