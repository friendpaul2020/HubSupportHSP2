import { Routes } from '@angular/router';
import { authGuard } from '../app/guards/auth-guard';
import { LoginComponent } from '../app/pages/login/login';
import { NgModule } from '@angular/core';

import { HomeComponent } from '../app/pages/home/home';
import { PaymentPageComponent } from './payment/pages/payment-page/payment-page.component';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  //{ path: '', component: PaymentPageComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'empresa',
    loadChildren: () =>
    import('../app/modules/empresa/empresa-routing-module').then(m => m.EmpresaRoutingModule),
  canActivate: [authGuard],
  data: { role: 'empresa' }
  },
  {
    path: 'especialistas',
    loadChildren: () => import('../app/modules/especialistas/especialistas-module').then(m => m.EspecialistasModule),
    canActivate: [authGuard],
    data: { role: 'especialista' }
  },
  {
    path: 'admin',
    loadChildren: () => import('../app/modules/admin/admin-module').then(m => m.AdminModule),
    canActivate: [authGuard],
    data: { role: 'admin' }
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
