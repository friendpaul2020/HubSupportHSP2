import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TicketPaymentService } from '../../services/ticket-payment.service';
import { PaymentService } from '../../services/payment.service';
import { Ticket, PaymentInfo } from '../../models/ticket-payment.model';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit, OnDestroy {
  // Datos principales
  tickets: Ticket[] = [];
  payments: PaymentInfo[] = [];
  filteredTickets: Ticket[] = [];
  isLoading = true;
  userEmail = '';

  // Filtros
  selectedStatus: string = 'todos';
  selectedPriority: string = 'todos';
  selectedCategory: string = 'todos';
  searchTerm: string = '';
  dateFrom: string = '';
  dateTo: string = '';

  // Estadísticas
  totalSpent = 0;
  activeTicketsCount = 0;
  resolvedTicketsCount = 0;
  totalTicketsCount = 0;

  // Paginación
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // Suscripciones
  private ticketsSubscription?: Subscription;
  private paymentStatusSubscription?: Subscription;

  constructor(
    private ticketService: TicketPaymentService,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit() {
    // Recuperar email del localStorage
    this.userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail') || '';

    if (this.userEmail) {
      this.loadData();
    } else {
      this.isLoading = false;
    }

    // Suscribirse a cambios en tiempo real de los tickets
    this.ticketsSubscription = this.ticketService.tickets$.subscribe(tickets => {
      if (tickets.length > 0) {
        this.tickets = tickets;
        this.applyFilters();
        this.calculateStats();
      }
    });

    // Suscribirse a cambios en el estado de pagos
    this.paymentStatusSubscription = this.paymentService.paymentStatus$.subscribe(status => {
      if (status) {
        this.loadData();
      }
    });
  }

  ngOnDestroy() {
    // Limpiar suscripciones
    this.ticketsSubscription?.unsubscribe();
    this.paymentStatusSubscription?.unsubscribe();
  }

  loadData() {
    this.isLoading = true;

    // Cargar tickets del usuario
    this.ticketService.getTicketsByEmail(this.userEmail).subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        this.applyFilters();
        this.calculateStats();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando tickets:', error);
        this.isLoading = false;
        this.showError('No se pudieron cargar los tickets');
      }
    });

    // Cargar historial de pagos
    this.paymentService.getPaymentHistory(this.userEmail).subscribe({
      next: (payments) => {
        this.payments = payments;
        this.calculateStats();
      },
      error: (error) => {
        console.error('Error cargando pagos:', error);
      }
    });
  }

  calculateStats() {
    // Calcular total gastado (en centavos, convertir a dólares)
    this.totalSpent = this.payments.reduce((total, payment) => total + payment.amount, 0);

    // Total de tickets
    this.totalTicketsCount = this.tickets.length;

    // Contar tickets activos
    this.activeTicketsCount = this.tickets.filter(t =>
      t.status === 'abierto' || t.status === 'en_proceso' || t.status === 'pagado'
    ).length;

    // Contar tickets resueltos/cerrados
    this.resolvedTicketsCount = this.tickets.filter(t =>
      t.status === 'resuelto' || t.status === 'cerrado'
    ).length;
  }

  applyFilters() {
    let filtered = [...this.tickets];

    // Filtro por estado
    if (this.selectedStatus !== 'todos') {
      filtered = filtered.filter(ticket => ticket.status === this.selectedStatus);
    }

    // Filtro por prioridad
    if (this.selectedPriority !== 'todos') {
      filtered = filtered.filter(ticket => ticket.priority === this.selectedPriority);
    }

    // Filtro por categoría
    if (this.selectedCategory !== 'todos') {
      filtered = filtered.filter(ticket => ticket.category === this.selectedCategory);
    }

    // Filtro por búsqueda
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(ticket =>
        ticket.ticketId.toLowerCase().includes(term) ||
        ticket.subject.toLowerCase().includes(term) ||
        ticket.description.toLowerCase().includes(term)
      );
    }

    // Filtro por fecha
    if (this.dateFrom) {
      const fromDate = new Date(this.dateFrom);
      filtered = filtered.filter(ticket => new Date(ticket.createdAt) >= fromDate);
    }

    if (this.dateTo) {
      const toDate = new Date(this.dateTo);
      toDate.setHours(23, 59, 59);
      filtered = filtered.filter(ticket => new Date(ticket.createdAt) <= toDate);
    }

    // Ordenar por fecha (más reciente primero)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    this.filteredTickets = filtered;
    this.totalPages = Math.ceil(this.filteredTickets.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  onStatusChange() {
    this.applyFilters();
  }

  onPriorityChange() {
    this.applyFilters();
  }

  onCategoryChange() {
    this.applyFilters();
  }

  onSearch() {
    this.applyFilters();
  }

  onDateChange() {
    this.applyFilters();
  }

  clearFilters() {
    this.selectedStatus = 'todos';
    this.selectedPriority = 'todos';
    this.selectedCategory = 'todos';
    this.searchTerm = '';
    this.dateFrom = '';
    this.dateTo = '';
    this.applyFilters();
  }

  setUserEmail() {
    if (this.userEmail && this.userEmail.includes('@')) {
      localStorage.setItem('userEmail', this.userEmail);
      sessionStorage.setItem('userEmail', this.userEmail);
      this.loadData();
    } else {
      this.showError('Por favor ingresa un email válido');
    }
  }

  logout() {
    localStorage.removeItem('userEmail');
    sessionStorage.removeItem('userEmail');
    this.userEmail = '';
    this.tickets = [];
    this.filteredTickets = [];
    this.payments = [];
    this.calculateStats();
  }

  viewTicketDetail(ticket: Ticket) {
    this.router.navigate(['/payment/ticket', ticket.id]);
  }

  getStatusBadgeClass(status: string): string {
    const classes: { [key: string]: string } = {
      'abierto': 'badge-open',
      'en_proceso': 'badge-progress',
      'pagado': 'badge-paid',
      'resuelto': 'badge-resolved',
      'cerrado': 'badge-closed'
    };
    return classes[status] || 'badge-default';
  }

  getPriorityClass(priority: string): string {
    const classes: { [key: string]: string } = {
      'alta': 'priority-high',
      'media': 'priority-medium',
      'baja': 'priority-low'
    };
    return classes[priority] || '';
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'tecnico': '🔧',
      'soporte': '💬',
      'facturacion': '💰',
      'general': '📋'
    };
    return icons[category] || '📝';
  }

  getCategoryName(category: string): string {
    const names: { [key: string]: string } = {
      'tecnico': 'Soporte Técnico',
      'soporte': 'Soporte General',
      'facturacion': 'Facturación',
      'general': 'General'
    };
    return names[category] || category;
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'abierto': 'Abierto',
      'en_proceso': 'En Proceso',
      'pagado': 'Pagado',
      'resuelto': 'Resuelto',
      'cerrado': 'Cerrado'
    };
    return statusMap[status] || status;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount: number): string {
    return `$${(amount / 100).toFixed(2)} USD`;
  }

  getPaginatedTickets(): Ticket[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredTickets.slice(start, end);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  getPages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  showError(message: string) {
    // Puedes implementar un toast o alert
    console.error(message);
    alert(message);
  }

  refreshData() {
    this.loadData();
  }

  createNewTicket() {
    this.router.navigate(['/payment']);
  }
}
