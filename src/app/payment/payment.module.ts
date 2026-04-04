import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PaymentRoutingModule } from './payment-routing.module';
import { FormsModule } from '@angular/forms';

// Componentes
import { PaymentFormComponent } from './components/payment-form/payment-form.component';
import { PaymentSuccessComponent } from './components/payment-success/payment-success';
import { PaymentHistoryComponent } from './components/payment-history/payment-history';
import { PaymentPageComponent } from './pages/payment-page/payment-page.component';

export { PaymentPageComponent } from './pages/payment-page/payment-page.component';
// Servicios
import { PaymentService } from './services/payment.service';
import { TicketPaymentService } from './services/ticket-payment.service';

@NgModule({
  declarations: [
    PaymentFormComponent,
    PaymentSuccessComponent,
    PaymentHistoryComponent,
    PaymentPageComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    PaymentRoutingModule
  ],
  providers: [
    PaymentService,
    TicketPaymentService
  ],
  exports: [
    PaymentFormComponent,
    PaymentPageComponent
  ]
})
export class PaymentModule { }
