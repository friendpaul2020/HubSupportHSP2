import { Routes } from '@angular/router';
import { authGuard } from '../app/guards/auth-guard';
import { LoginComponent } from '../app/pages/login/login';

import { HomeComponent } from '../app/pages/home/home';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'empresa',
    loadChildren: () => import('../app/modules/empresa/empresa-module').then(m => m.EmpresaModule),
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
