import { Component, ElementRef, ViewChild, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../services/payment.service';
import { TicketPaymentService } from '../../services/ticket-payment.service';
import { Ticket, PaymentInfo } from '../../models/ticket-payment.model';

@Component({
  selector: 'app-payment-form',
  standalone: true,                          // ← agregar
  imports: [CommonModule, ReactiveFormsModule], // ← agregar
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})
export class PaymentFormComponent implements OnInit, AfterViewInit {
  @ViewChild('cardElement') cardElementRef!: ElementRef;
  @Output() paymentComplete = new EventEmitter<{ ticket: Ticket; payment: PaymentInfo }>();

  ticketForm: FormGroup;
  isProcessing = false;
  cardElement: any;
  elements: any;
  stripe: any;

  ticketPrices = {
    tecnico: 1000,
    soporte: 1500,
    facturacion: 500,
    general: 800
  };

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private ticketPaymentService: TicketPaymentService
  ) {
    this.ticketForm = this.fb.group({
      subject: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      userEmail: ['', [Validators.required, Validators.email]],
      userName: ['', Validators.required],
      category: ['general', Validators.required],
      priority: ['media', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    });
  }

  async ngOnInit() {
    this.stripe = await this.paymentService['stripePromise'];
  }

  async ngAfterViewInit() {
    if (!this.stripe) return;

    this.elements = this.stripe.elements();
    this.cardElement = this.elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#32325d',
          '::placeholder': { color: '#aab7c4' }
        }
      }
    });
    this.cardElement.mount(this.cardElementRef.nativeElement);
  }

  getCurrentAmount(): number {
    const category = this.ticketForm.get('category')?.value;
    return this.ticketPrices[category as keyof typeof this.ticketPrices] || 800;
  }

  async onSubmit() {
    if (this.ticketForm.invalid) {
      alert('Por favor complete todos los campos correctamente');
      return;
    }

    this.isProcessing = true;
    const formValue = this.ticketForm.value;
    const amount = this.getCurrentAmount();

    try {
      const { clientSecret, paymentIntentId } = await this.paymentService.createTicketPayment({
        ticket: {
          subject: formValue.subject,
          description: formValue.description,
          userEmail: formValue.userEmail,
          userName: formValue.userName,
          category: formValue.category,
          priority: formValue.priority
        },
        paymentAmount: amount,
        currency: 'usd',
        successUrl: window.location.origin + '/payment/success',
        cancelUrl: window.location.origin + '/payment/cancel'
      });

      const result = await this.paymentService.confirmPayment(clientSecret);

      if (result.paymentIntent.status === 'succeeded') {
        const paymentInfo: PaymentInfo = {
          paymentIntentId: result.paymentIntent.id,
          amount: amount,
          currency: 'usd',
          status: 'completado',
          paymentDate: new Date()
        };

        const newTicket = await this.ticketPaymentService.createTicketWithPayment(
          {
            subject: formValue.subject,
            description: formValue.description,
            userEmail: formValue.userEmail,
            userName: formValue.userName,
            category: formValue.category,
            priority: formValue.priority,
            status: 'pagado'
          },
          paymentInfo
        ).toPromise();

        this.paymentComplete.emit({ ticket: newTicket!, payment: paymentInfo });
        this.ticketForm.reset();
        this.cardElement.clear();
        alert('✅ ¡Pago completado y ticket creado exitosamente!');
      }
    } catch (error: any) {
      console.error('Error:', error);
      alert(`❌ Error en el pago: ${error.message}`);
    } finally {
      this.isProcessing = false;
    }
  }
}
