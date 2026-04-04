import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ticket, PaymentInfo } from '../../models/ticket-payment.model';
import { PaymentFormComponent } from '../../components/payment-form/payment-form.component'; // ← verificar ruta

@Component({
  selector: 'app-payment-page',
  standalone: true,                              // ← agregar
  imports: [CommonModule, PaymentFormComponent], // ← agregar
  template: `
    <div class="payment-page">
      <div class="container">
        <app-payment-form (paymentComplete)="onPaymentComplete($event)"></app-payment-form>
      </div>
    </div>
  `,
  styles: [`
    .payment-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
  `]
})
export class PaymentPageComponent {
  onPaymentComplete(event: { ticket: Ticket; payment: PaymentInfo }) {
    console.log('Pago completado:', event);
    // Redirigir o mostrar mensaje de éxito
  }
}
