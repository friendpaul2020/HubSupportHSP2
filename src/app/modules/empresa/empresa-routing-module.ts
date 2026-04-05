import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmpresaComponent } from '../empresa/dashboard/empresa.component';
// src/app/modules/empresa/empresa-routing.ts

import { TicketDashboardComponent } from './tickets/components/ticket-dashboard/ticket-dashboard.component';
import { TicketListComponent } from './tickets/components/ticket-list/ticket-list.component';
import { TicketFormComponent } from './tickets/components/ticket-form/ticket-form.component';


const routes: Routes = [
  { path: '', component: EmpresaComponent },
  { path: 'tickets', component: TicketListComponent },
  { path: 'nuevo', component: TicketFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpresaRoutingModule { }
