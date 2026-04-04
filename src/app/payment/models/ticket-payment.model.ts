export interface Ticket {
  id: number;
  ticketId: string;
  subject: string;
  description: string;
  userEmail: string;
  userName: string;
  priority: 'baja' | 'media' | 'alta';
  status: 'abierto' | 'en_proceso' | 'resuelto' | 'cerrado' | 'pagado';
  category: 'tecnico' | 'soporte' | 'facturacion' | 'general';
  createdAt: Date;
  updatedAt?: Date;
  paymentInfo?: PaymentInfo;
}

export interface PaymentInfo {
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: 'pendiente' | 'completado' | 'fallido' | 'reembolsado';
  paymentDate?: Date;
  stripePaymentIntent?: any;
}

export interface CreateTicketPaymentRequest {
  ticket: Partial<Ticket>;
  paymentAmount: number;
  currency: string;
  successUrl: string;
  cancelUrl: string;
}

export interface PaymentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export interface TicketWithPayment extends Ticket {
  paymentInfo: PaymentInfo;
}

export type TicketStatus = Ticket['status'];
export type PaymentStatus = PaymentInfo['status'];
export type TicketPriority = Ticket['priority'];
export type TicketCategory = Ticket['category'];
