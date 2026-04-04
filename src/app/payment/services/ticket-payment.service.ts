import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Ticket, PaymentInfo } from '../models/ticket-payment.model';
import { stripeEnvironment } from '../../../environments/environment.stripe';

@Injectable({
  providedIn: 'root'
})
export class TicketPaymentService {
  private apiUrl = stripeEnvironment.apiUrl;
  private ticketsSubject = new BehaviorSubject<Ticket[]>([]);

  // Observable público para que otros componentes se suscriban
  tickets$ = this.ticketsSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Crear un ticket asociado a un pago
   * @param ticket - Datos del ticket
   * @param paymentInfo - Información del pago
   * @returns Ticket creado
   */
  createTicketWithPayment(ticket: Partial<Ticket>, paymentInfo: PaymentInfo): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.apiUrl}/tickets/create-with-payment`, {
      ticket,
      paymentInfo
    }).pipe(
      tap(newTicket => {
        const currentTickets = this.ticketsSubject.value;
        this.ticketsSubject.next([newTicket, ...currentTickets]);
      })
    );
  }

  /**
   * Obtener tickets por email de usuario
   * @param email - Email del usuario
   * @returns Lista de tickets del usuario
   */
  getTicketsByEmail(email: string): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/tickets/user/${email}`).pipe(
      tap(tickets => this.ticketsSubject.next(tickets))
    );
  }

  /**
   * Obtener un ticket por su ID
   * @param ticketId - ID del ticket
   * @returns Ticket encontrado
   */
  getTicketById(ticketId: string): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/tickets/${ticketId}`);
  }

  /**
   * Actualizar el estado de un ticket
   * @param ticketId - ID del ticket
   * @param status - Nuevo estado
   * @returns Ticket actualizado
   */
  updateTicketStatus(ticketId: string, status: Ticket['status']): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiUrl}/tickets/${ticketId}/status`, { status }).pipe(
      tap(updatedTicket => {
        const currentTickets = this.ticketsSubject.value;
        const index = currentTickets.findIndex(t => t.ticketId === ticketId);
        if (index !== -1) {
          currentTickets[index] = updatedTicket;
          this.ticketsSubject.next([...currentTickets]);
        }
      })
    );
  }

  /**
   * Agregar un comentario a un ticket
   * @param ticketId - ID del ticket
   * @param comment - Comentario a agregar
   * @returns Ticket actualizado
   */
  addCommentToTicket(ticketId: string, comment: string): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.apiUrl}/tickets/${ticketId}/comments`, { comment });
  }

  /**
   * Obtener todos los tickets (para administradores)
   * @returns Lista completa de tickets
   */
  getAllTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/tickets/all`);
  }

  /**
   * Asignar un ticket a un agente
   * @param ticketId - ID del ticket
   * @param agentId - ID del agente
   * @returns Ticket actualizado
   */
  assignTicketToAgent(ticketId: string, agentId: string): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiUrl}/tickets/${ticketId}/assign`, { agentId });
  }

  /**
   * Cerrar un ticket
   * @param ticketId - ID del ticket
   * @param resolution - Resolución del problema
   * @returns Ticket cerrado
   */
  closeTicket(ticketId: string, resolution?: string): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiUrl}/tickets/${ticketId}/close`, { resolution });
  }
}
