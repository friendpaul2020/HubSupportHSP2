import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { stripeEnvironment } from '../../environments/environment.stripe';
import { CreateTicketPaymentRequest, PaymentInfo } from '../../app/payment/models/ticket-payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = stripeEnvironment.apiUrl;
  private stripePromise = loadStripe(stripeEnvironment.stripePublicKey);
  private paymentStatusSubject = new BehaviorSubject<PaymentInfo | null>(null);

  // Observable público para que otros componentes se suscriban
  paymentStatus$ = this.paymentStatusSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Crear una intención de pago en Stripe
   * @param request - Datos del ticket y pago
   * @returns clientSecret y paymentIntentId
   */
  async createTicketPayment(request: CreateTicketPaymentRequest): Promise<{ clientSecret: string; paymentIntentId: string }> {
    try {
      const response = await this.http.post<{ clientSecret: string; paymentIntentId: string }>(
        `${this.apiUrl}/create-ticket-payment`,
        request
      ).toPromise();

      if (!response) {
        throw new Error('No se pudo crear el pago');
      }

      return response;
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      throw new Error(error.message || 'Error al crear la intención de pago');
    }
  }

  /**
   * Confirmar el pago con Stripe
   * @param clientSecret - El client secret del PaymentIntent
   * @returns Resultado del pago
   */
  async confirmPayment(clientSecret: string): Promise<any> {
    const stripe = await this.stripePromise;

    if (!stripe) {
      throw new Error('Stripe no se pudo inicializar');
    }

    const result = await stripe.confirmCardPayment(clientSecret);

    if (result.error) {
      throw result.error;
    }

    // Actualizar el estado del pago
    if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
      const paymentInfo: PaymentInfo = {
        paymentIntentId: result.paymentIntent.id,
        amount: result.paymentIntent.amount,
        currency: result.paymentIntent.currency,
        status: 'completado',
        paymentDate: new Date(),
        stripePaymentIntent: result.paymentIntent
      };

      this.paymentStatusSubject.next(paymentInfo);
    }

    return result;
  }

  /**
   * Obtener el estado de un pago por su ID
   * @param paymentIntentId - ID del PaymentIntent de Stripe
   * @returns Información del pago
   */
  getPaymentStatus(paymentIntentId: string): Observable<PaymentInfo> {
    return this.http.get<PaymentInfo>(`${this.apiUrl}/payment-status/${paymentIntentId}`);
  }

  /**
   * Obtener el historial de pagos de un usuario
   * @param email - Email del usuario
   * @returns Lista de pagos realizados
   */
  getPaymentHistory(email: string): Observable<PaymentInfo[]> {
    return this.http.get<PaymentInfo[]>(`${this.apiUrl}/payments/history/${email}`);
  }

  /**
   * Reembolsar un pago
   * @param paymentIntentId - ID del PaymentIntent a reembolsar
   * @param amount - Monto a reembolsar (opcional, si no se especifica se reembolsa todo)
   * @returns Resultado del reembolso
   */
  refundPayment(paymentIntentId: string, amount?: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/refund-payment`, {
      paymentIntentId,
      amount: amount ? Math.round(amount) : undefined
    });
  }

  /**
   * Obtener la instancia de Stripe
   * @returns Promesa con la instancia de Stripe
   */
  async getStripeInstance(): Promise<Stripe | null> {
    return await this.stripePromise;
  }

  /**
   * Crear un método de pago para futuros usos
   * @param paymentMethodId - ID del método de pago
   * @returns Método de pago creado
   */
  attachPaymentMethodToCustomer(paymentMethodId: string, customerId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/attach-payment-method`, {
      paymentMethodId,
      customerId
    });
  }

  /**
   * Procesar pago con método de pago guardado
   * @param paymentMethodId - ID del método de pago guardado
   * @param amount - Monto a cobrar
   * @param currency - Moneda
   * @returns Resultado del pago
   */
  processSavedPayment(paymentMethodId: string, amount: number, currency: string = 'usd'): Observable<any> {
    return this.http.post(`${this.apiUrl}/process-saved-payment`, {
      paymentMethodId,
      amount: Math.round(amount),
      currency
    });
  }
}
