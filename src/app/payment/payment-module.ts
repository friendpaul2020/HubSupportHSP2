import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing-module';
import { PaymentPage } from './payment-page/payment-page';

@NgModule({
  declarations: [PaymentPage],
  imports: [CommonModule, PaymentRoutingModule],
})
export class PaymentModule {}
