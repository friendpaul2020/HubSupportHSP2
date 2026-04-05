import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TicketDashboardComponent } from './tickets/components/ticket-dashboard/ticket-dashboard.component';
import { TicketFormComponent } from './tickets/components/ticket-form/ticket-form.component';
import { TicketListComponent } from './tickets/components/ticket-list/ticket-list.component';

@NgModule({
  declarations: [],       // ← vacío
  imports: [
    CommonModule,
    FormsModule,
    TicketDashboardComponent,  // ← aquí
    TicketFormComponent,
    TicketListComponent
  ],
  exports: [
    TicketDashboardComponent,  // ← se pueden exportar desde imports
    TicketFormComponent,
    TicketListComponent
  ]
})
export class TicketsModule { }
