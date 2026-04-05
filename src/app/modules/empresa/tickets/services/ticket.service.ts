import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { EmpresaService } from '../../services/empresa.service';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private apiUrl = 'http://localhost:3000/api/tickets';

  constructor(
    private http: HttpClient,
    private empresaService: EmpresaService
  ) {}

  getTickets(): Observable<any> {
    return this.empresaService.getEmpresaActual().pipe(
      switchMap(empresa => this.http.get(`${this.apiUrl}?empresaId=${empresa.id}`))
    );
  }

  getTicketById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createTicket(data: Partial<any>): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  updateTicket(id: string, data: Partial<any>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteTicket(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getEstadisticas(): Observable<any> {
    return this.empresaService.getEmpresaActual().pipe(
      switchMap(empresa => this.http.get(`${this.apiUrl}/estadisticas?empresaId=${empresa.id}`))
    );
  }

  getTicketsByEstado(estado: string): Observable<any> {
    return this.empresaService.getEmpresaActual().pipe(
      switchMap(empresa => this.http.get(`${this.apiUrl}?empresaId=${empresa.id}&estado=${estado}`))
    );
  }

  getTicketsByPrioridad(prioridad: string): Observable<any> {
    return this.empresaService.getEmpresaActual().pipe(
      switchMap(empresa => this.http.get(`${this.apiUrl}?empresaId=${empresa.id}&prioridad=${prioridad}`))
    );
  }
}
