import { Component, OnInit } from '@angular/core';
import { EmpresaService, Empresa } from '../services/empresa.service';
import { CommonModule } from '@angular/common';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs';
import { TicketDashboardComponent } from '../tickets/components/ticket-dashboard/ticket-dashboard.component';
import { TicketFormComponent } from '../tickets/components/ticket-form/ticket-form.component';
import { TicketListComponent } from '../tickets/components/ticket-list/ticket-list.component';

@Component({
  selector: 'app-empresa-dashboard',
  imports: [
    CommonModule,
    Tabs, TabList, Tab, TabPanels, TabPanel,
    TicketDashboardComponent,
    TicketFormComponent,
    TicketListComponent
  ],
  templateUrl: './empresa.component.html'
})
export class EmpresaComponent implements OnInit {
  empresa: Empresa | null = null;

  constructor(private empresaService: EmpresaService) {}

  ngOnInit() {
    this.empresaService.getEmpresaActual().subscribe(empresa => {
      this.empresa = empresa;
    });
  }

  onTicketCreado() { // ← agregar
    console.log('Ticket creado exitosamente');
  }
}
