import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { EmpresaService } from '../../../services/empresa.service';
import { Empresa } from '../../../models/empresa.model';
import { CommonModule } from '@angular/common'; // ← agregar
import { FormsModule } from '@angular/forms';   // ← agregar

@Component({
  selector: 'app-ticket-dashboard',
  templateUrl: './ticket-dashboard.component.html',
  styleUrls: ['./ticket-dashboard.component.css'],
  standalone: true,
  imports: [
    CommonModule, // ← resuelve *ngIf y *ngFor
    FormsModule   // ← resuelve ngModel
  ]
})
export class TicketDashboardComponent implements OnInit {
  stats = {
    total: 0,
    abiertos: 0,
    enProceso: 0,
    cerrados: 0,
    porPrioridad: { alta: 0, media: 0, baja: 0 }
  };

  empresaActual: Empresa | null = null;
  cargando = true;

  constructor(
    private ticketService: TicketService,
    private empresaService: EmpresaService
  ) {}

  ngOnInit(): void {
    this.empresaService.getEmpresaActual().subscribe(empresa => {
      this.empresaActual = empresa;
      this.cargarEstadisticas();
    });
  }

  cargarEstadisticas() {
    this.cargando = true;
    this.ticketService.getEstadisticas().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error cargando estadísticas:', error);
        this.cargando = false;
      }
    });
  }

  actualizarDatos() {
    this.cargarEstadisticas();
  }
}
