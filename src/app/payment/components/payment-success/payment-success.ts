import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { TicketPaymentService } from '../../services/ticket-payment.service';
import { Ticket, PaymentInfo } from '../../models/ticket-payment.model';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
  paymentIntentId: string = '';
  ticket: Ticket | null = null;
  paymentInfo: PaymentInfo | null = null;
  isLoading = true;
  timer = 10;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private ticketService: TicketPaymentService
  ) {}

  ngOnInit() {
    this.paymentIntentId = this.route.snapshot.queryParamMap.get('payment_intent') || '';

    if (this.paymentIntentId) {
      this.loadPaymentDetails();
    } else {
      this.isLoading = false;
    }

    // Iniciar contador para redirección automática
    const interval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        clearInterval(interval);
        this.router.navigate(['/payment/history']);
      }
    }, 1000);
  }

  async loadPaymentDetails() {
    try {
      this.paymentService.getPaymentStatus(this.paymentIntentId).subscribe({
        next: (paymentInfo) => {
          this.paymentInfo = paymentInfo;
          this.loadTicketByPayment();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error cargando pago:', error);
          this.isLoading = false;
        }
      });
    } catch (error) {
      console.error('Error:', error);
      this.isLoading = false;
    }
  }

  loadTicketByPayment() {
    this.ticketService.tickets$.subscribe(tickets => {
      this.ticket = tickets.find(t => t.paymentInfo?.paymentIntentId === this.paymentIntentId) || null;
    });
  }

  goToTickets() {
    this.router.navigate(['/payment/history']);
  }

  downloadReceipt() {
    const receiptContent = `
COMPROBANTE DE PAGO
==================
Ticket ID: ${this.ticket?.ticketId || 'N/A'}
Fecha: ${new Date().toLocaleString()}
Monto: $${((this.paymentInfo?.amount || 0) / 100).toFixed(2)} USD
Estado: Completado
ID de transacción: ${this.paymentIntentId}
Email: ${this.ticket?.userEmail || 'N/A'}
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recibo-${this.ticket?.ticketId || 'pago'}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
