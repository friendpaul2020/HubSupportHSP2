import { Component } from '@angular/core';
import { PaymentFormComponent } from '../components/payment-form/payment-form.component';

@Component({
  selector: 'app-payment-page',
  standalone: false,
  styleUrl: './payment-page.css',
  imports: [

    PaymentFormComponent  // ← agregar aquí
  ],
  templateUrl: './payment-page.html',
})
export class PaymentPage {}
