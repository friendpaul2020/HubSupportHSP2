import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../models/ticket.model';
import { CommonModule } from '@angular/common'; // ← incluye NgIf y NgFor
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [
    CommonModule,  // ← esto resuelve *ngIf y *ngFor
    FormsModule    // ← esto resuelve ngModel
  ],
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit {
  tickets: Ticket[] = [];
  ticketsFiltrados: Ticket[] = [];
  cargando = true;

  // Filtros
  filtroEstado: string = 'todos';
  filtroPrioridad: string = 'todos';
  busquedaTexto: string = '';

  // Paginación
  paginaActual: number = 1;
  itemsPorPagina: number = 10;

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.cargarTickets();
  }

  cargarTickets() {
    this.cargando = true;
    this.ticketService.getTickets().subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error cargando tickets:', error);
        this.cargando = false;
        alert('Error al cargar los tickets');
      }
    });
  }

  aplicarFiltros() {
    let filtrados = [...this.tickets];

    // Filtro por estado
    if (this.filtroEstado !== 'todos') {
      filtrados = filtrados.filter(t => t.estado === this.filtroEstado);
    }

    // Filtro por prioridad
    if (this.filtroPrioridad !== 'todos') {
      filtrados = filtrados.filter(t => t.prioridad === this.filtroPrioridad);
    }

    // Búsqueda por texto (título o descripción)
    if (this.busquedaTexto.trim()) {
      const busqueda = this.busquedaTexto.toLowerCase();
      filtrados = filtrados.filter(t =>
        t.titulo.toLowerCase().includes(busqueda) ||
        t.descripcion.toLowerCase().includes(busqueda)
      );
    }

    // Ordenar por fecha (más recientes primero)
    filtrados.sort((a, b) =>
      new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
    );

    this.ticketsFiltrados = filtrados;
    this.paginaActual = 1; // Resetear a primera página al filtrar
  }

  onFiltroCambiar() {
    this.aplicarFiltros();
  }

  onBusquedaCambiar() {
    this.aplicarFiltros();
  }

  cambiarEstado(ticket: Ticket, nuevoEstado: string) {
    const estadosValidos = ['Abierto', 'En proceso', 'Cerrado'];
    if (!estadosValidos.includes(nuevoEstado)) return;

    const confirmacion = confirm(`¿Cambiar estado de "${ticket.titulo}" a "${nuevoEstado}"?`);
    if (!confirmacion) return;

    this.ticketService.updateTicket(ticket.id!, { estado: nuevoEstado as any }).subscribe({
      next: () => {
        ticket.estado = nuevoEstado as any;
        this.aplicarFiltros();
        alert('✅ Estado actualizado');
      },
      error: (err) => {
        console.error('Error actualizando estado:', err);
        alert('❌ Error al actualizar el estado');
      }
    });
  }

  eliminarTicket(id: string, titulo: string) {
    const confirmacion = confirm(`¿Eliminar permanentemente el ticket "${titulo}"?`);
    if (!confirmacion) return;

    this.ticketService.deleteTicket(id).subscribe({
      next: () => {
        this.tickets = this.tickets.filter(t => t.id !== id);
        this.aplicarFiltros();
        alert('🗑️ Ticket eliminado');
      },
      error: (err) => {
        console.error('Error eliminando ticket:', err);
        alert('❌ Error al eliminar el ticket');
      }
    });
  }

  // Paginación
  get totalPaginas(): number {
    return Math.ceil(this.ticketsFiltrados.length / this.itemsPorPagina);
  }

  get ticketsPaginados(): Ticket[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.ticketsFiltrados.slice(inicio, fin);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  // Colores y estilos
  getEstadoClass(estado: string): string {
    switch(estado) {
      case 'Abierto': return 'estado-abierto';
      case 'En proceso': return 'estado-proceso';
      case 'Cerrado': return 'estado-cerrado';
      default: return '';
    }
  }

  getPrioridadClass(prioridad: string): string {
    switch(prioridad) {
      case 'Alta': return 'prioridad-alta';
      case 'Media': return 'prioridad-media';
      case 'Baja': return 'prioridad-baja';
      default: return '';
    }
  }

  getPrioridadIcono(prioridad: string): string {
    switch(prioridad) {
      case 'Alta': return '🔴';
      case 'Media': return '🟡';
      case 'Baja': return '🟢';
      default: return '⚪';
    }
  }

  formatearFecha(fecha: Date): string {
    const date = new Date(fecha);
    const ahora = new Date();
    const diffMs = ahora.getTime() - date.getTime();
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHoras < 24) {
      return `Hace ${diffHoras} horas`;
    } else if (diffHoras < 48) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  }
}
