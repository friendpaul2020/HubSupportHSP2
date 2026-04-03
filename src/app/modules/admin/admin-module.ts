import { Gestion } from './gestion/gestion';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing-module';

@NgModule({
  declarations: [],
  imports: [CommonModule, AdminRoutingModule,Gestion],
  exports: [Gestion ]  // ← Agregar esta línea
})
export class AdminModule {}
