import { Component, EventEmitter, Output } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../models/ticket.model';
import { FormsModule } from '@angular/forms'; // ← agregar

@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [
    FormsModule  // ← agregar
  ],
  templateUrl: './ticket-form.component.html',
  styleUrls: ['./ticket-form.component.css']
})
export class TicketFormComponent {
  @Output() ticketCreado = new EventEmitter<void>();

  ticket: Ticket = {
    titulo: '',
    descripcion: '',
    prioridad: 'Media',
    estado: 'Abierto',
    fechaCreacion: new Date(),
    empresaId: '' // Se llenará automáticamente en el servicio
  };

  constructor(private ticketService: TicketService) {}

  onSubmit() {
    if (!this.ticket.titulo || !this.ticket.descripcion) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    this.ticketService.createTicket(this.ticket).subscribe({
      next: () => {
        alert('✅ Ticket creado exitosamente');
        this.resetForm();
        this.ticketCreado.emit();
      },
      error: (err) => {
        console.error('Error al crear ticket:', err);
        alert('❌ Error al crear el ticket');
      }
    });
  }

  resetForm() {
    this.ticket = {
      titulo: '',
      descripcion: '',
      prioridad: 'Media',
      estado: 'Abierto',
      fechaCreacion: new Date(),
      empresaId: ''
    };
  }
}
