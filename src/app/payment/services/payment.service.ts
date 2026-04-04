import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { stripeEnvironment } from '../../../environments/environment.stripe';
import { CreateTicketPaymentRequest, PaymentInfo } from '../models/ticket-payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = stripeEnvironment.apiUrl;
  private stripePromise = loadStripe(stripeEnvironment.stripePublicKey);
  private paymentStatusSubject = new BehaviorSubject<PaymentInfo | null>(null);

  paymentStatus$ = this.paymentStatusSubject.asObservable();

  constructor(private http: HttpClient) {}

  async createTicketPayment(request: CreateTicketPaymentRequest): Promise<{ clientSecret: string; paymentIntentId: string }> {
    const response = await this.http.post<{ clientSecret: string; paymentIntentId: string }>(
      `${this.apiUrl}/create-ticket-payment`,
      request
    ).toPromise();

    if (!response) throw new Error('No se pudo crear el pago');
    return response;
  }

  async confirmPayment(clientSecret: string): Promise<any> {
    const stripe = await this.stripePromise;
    if (!stripe) throw new Error('Stripe no se pudo inicializar');

    const result = await stripe.confirmCardPayment(clientSecret);
    if (result.error) throw result.error;

    this.paymentStatusSubject.next({
      paymentIntentId: result.paymentIntent.id,
      amount: result.paymentIntent.amount,
      currency: result.paymentIntent.currency,
      status: 'completado',
      paymentDate: new Date(),
      stripePaymentIntent: result.paymentIntent
    });

    return result;
  }

  getPaymentHistory(email: string): Observable<PaymentInfo[]> {
    return this.http.get<PaymentInfo[]>(`${this.apiUrl}/payments/history/${email}`);
  }
  getPaymentStatus(paymentIntentId: string): Observable<PaymentInfo> {
    return this.http.get<PaymentInfo>(`${this.apiUrl}/payments/status/${paymentIntentId}`);
  }
}
