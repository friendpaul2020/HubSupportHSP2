import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

// Modelo de Empresa
export interface Empresa {
  id: string;
  nombre: string;
  ruc: string;
  direccion: string;
  telefono: string;
  email: string;
  logo?: string;
  plan: 'Básico' | 'Premium' | 'Empresarial';
  estado: 'Activo' | 'Inactivo' | 'Suspendido';
  fechaRegistro: Date;
  configuracion?: {
    maxTickets?: number;
    permiteAdjuntos?: boolean;
    tiempoRespuesta?: number;
  };
}

@Injectable({
  providedIn: 'root' // Esto lo hace disponible en toda la aplicación
})
export class EmpresaService {
  private apiUrl = 'http://localhost:3000/api/empresas';

  // BehaviorSubject para mantener la empresa actual en memoria
  private empresaActualSubject = new BehaviorSubject<Empresa | null>(null);
  public empresaActual$ = this.empresaActualSubject.asObservable();

  // Cache de empresas
  private empresasCache: Empresa[] = [];
  private cacheTimestamp: number = 0;
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  constructor(private http: HttpClient) {
    // Intentar cargar empresa guardada en localStorage al iniciar
    this.cargarEmpresaGuardada();
  }

  /**
   * Obtener la empresa actual del usuario logueado
   */
  getEmpresaActual(): Observable<Empresa> {
    // Si ya tenemos la empresa en memoria, devolverla
    if (this.empresaActualSubject.value) {
      return this.empresaActualSubject.asObservable() as Observable<Empresa>;
    }

    // Si no, intentar cargar desde localStorage
    const empresaGuardada = this.getEmpresaFromStorage();
    if (empresaGuardada) {
      this.empresaActualSubject.next(empresaGuardada);
      return this.empresaActualSubject.asObservable() as Observable<Empresa>;
    }

    // Si no hay empresa guardada, obtener desde el backend
    // Asumiendo que el backend devuelve la empresa basada en el token JWT
    return this.http.get<Empresa>(`${this.apiUrl}/actual`).pipe(
      tap(empresa => {
        this.empresaActualSubject.next(empresa);
        this.guardarEmpresaEnStorage(empresa);
      }),
      catchError(error => {
        console.error('Error obteniendo empresa actual:', error);
        // Devolver empresa de demostración para desarrollo
        return of(this.getEmpresaDemo());
      })
    );
  }

  /**
   * Establecer la empresa actual manualmente (ej: después de login o selección)
   */
  setEmpresaActual(empresa: Empresa): void {
    this.empresaActualSubject.next(empresa);
    this.guardarEmpresaEnStorage(empresa);
  }

  /**
   * Obtener todas las empresas (solo para administradores)
   */
  getEmpresas(forceRefresh: boolean = false): Observable<Empresa[]> {
    // Usar caché si está vigente y no se fuerza actualización
    if (!forceRefresh && this.isCacheValid() && this.empresasCache.length > 0) {
      return of(this.empresasCache);
    }

    return this.http.get<Empresa[]>(this.apiUrl).pipe(
      tap(empresas => {
        this.empresasCache = empresas;
        this.cacheTimestamp = Date.now();
      }),
      catchError(error => {
        console.error('Error obteniendo empresas:', error);
        return of([]);
      })
    );
  }

  /**
   * Obtener una empresa por su ID
   */
  getEmpresaById(id: string): Observable<Empresa> {
    // Buscar en caché primero
    const cacheEmpresa = this.empresasCache.find(e => e.id === id);
    if (cacheEmpresa) {
      return of(cacheEmpresa);
    }

    return this.http.get<Empresa>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error obteniendo empresa:', error);
        throw error;
      })
    );
  }

  /**
   * Crear una nueva empresa
   */
  createEmpresa(empresa: Partial<Empresa>): Observable<Empresa> {
    return this.http.post<Empresa>(this.apiUrl, empresa).pipe(
      tap(nuevaEmpresa => {
        // Actualizar caché
        this.empresasCache.push(nuevaEmpresa);
        this.cacheTimestamp = Date.now();
      }),
      catchError(error => {
        console.error('Error creando empresa:', error);
        throw error;
      })
    );
  }

  /**
   * Actualizar empresa existente
   */
  updateEmpresa(id: string, empresa: Partial<Empresa>): Observable<Empresa> {
    return this.http.put<Empresa>(`${this.apiUrl}/${id}`, empresa).pipe(
      tap(empresaActualizada => {
        // Actualizar en caché
        const index = this.empresasCache.findIndex(e => e.id === id);
        if (index !== -1) {
          this.empresasCache[index] = empresaActualizada;
        }

        // Actualizar empresa actual si es la misma
        if (this.empresaActualSubject.value?.id === id) {
          this.empresaActualSubject.next(empresaActualizada);
          this.guardarEmpresaEnStorage(empresaActualizada);
        }

        this.cacheTimestamp = Date.now();
      }),
      catchError(error => {
        console.error('Error actualizando empresa:', error);
        throw error;
      })
    );
  }

  /**
   * Eliminar empresa (solo administradores)
   */
  deleteEmpresa(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        // Eliminar de caché
        this.empresasCache = this.empresasCache.filter(e => e.id !== id);
        this.cacheTimestamp = Date.now();
      }),
      catchError(error => {
        console.error('Error eliminando empresa:', error);
        throw error;
      })
    );
  }

  /**
   * Cambiar plan de la empresa
   */
  cambiarPlan(id: string, plan: 'Básico' | 'Premium' | 'Empresarial'): Observable<Empresa> {
    return this.http.patch<Empresa>(`${this.apiUrl}/${id}/plan`, { plan }).pipe(
      tap(empresaActualizada => {
        const index = this.empresasCache.findIndex(e => e.id === id);
        if (index !== -1) {
          this.empresasCache[index] = empresaActualizada;
        }

        if (this.empresaActualSubject.value?.id === id) {
          this.empresaActualSubject.next(empresaActualizada);
          this.guardarEmpresaEnStorage(empresaActualizada);
        }
      })
    );
  }

  /**
   * Obtener estadísticas de la empresa (para dashboard)
   */
  getEstadisticas(empresaId?: string): Observable<any> {
    const id = empresaId || this.empresaActualSubject.value?.id;
    if (!id) {
      return of({ error: 'No hay empresa seleccionada' });
    }

    return this.http.get(`${this.apiUrl}/${id}/estadisticas`).pipe(
      catchError(error => {
        console.error('Error obteniendo estadísticas:', error);
        return of({
          totalUsuarios: 0,
          totalTickets: 0,
          ticketsAbiertos: 0,
          satisfaccion: 0
        });
      })
    );
  }

  /**
   * Subir logo de la empresa
   */
  uploadLogo(empresaId: string, file: File): Observable<{ logoUrl: string }> {
    const formData = new FormData();
    formData.append('logo', file);

    return this.http.post<{ logoUrl: string }>(`${this.apiUrl}/${empresaId}/logo`, formData).pipe(
      tap(result => {
        // Actualizar empresa en caché con nuevo logo
        const index = this.empresasCache.findIndex(e => e.id === empresaId);
        if (index !== -1) {
          this.empresasCache[index].logo = result.logoUrl;
        }

        if (this.empresaActualSubject.value?.id === empresaId) {
          const empresaActual = this.empresaActualSubject.value;
          empresaActual.logo = result.logoUrl;
          this.empresaActualSubject.next(empresaActual);
          this.guardarEmpresaEnStorage(empresaActual);
        }
      })
    );
  }

  /**
   * Validar RUC de empresa
   */
  validarRUC(ruc: string): Observable<{ valido: boolean; razonSocial?: string }> {
    return this.http.post<{ valido: boolean; razonSocial?: string }>(`${this.apiUrl}/validar-ruc`, { ruc });
  }

  // ============= MÉTODOS PRIVADOS =============

  /**
   * Guardar empresa en localStorage
   */
  private guardarEmpresaEnStorage(empresa: Empresa): void {
    try {
      localStorage.setItem('empresa_actual', JSON.stringify({
        ...empresa,
        fechaRegistro: empresa.fechaRegistro instanceof Date ?
          empresa.fechaRegistro.toISOString() : empresa.fechaRegistro
      }));
    } catch (error) {
      console.warn('Error guardando empresa en localStorage:', error);
    }
  }

  /**
   * Obtener empresa desde localStorage
   */
  private getEmpresaFromStorage(): Empresa | null {
    try {
      const stored = localStorage.getItem('empresa_actual');
      if (stored) {
        const empresa = JSON.parse(stored);
        // Convertir fecha de string a Date
        if (empresa.fechaRegistro) {
          empresa.fechaRegistro = new Date(empresa.fechaRegistro);
        }
        return empresa;
      }
    } catch (error) {
      console.warn('Error leyendo empresa de localStorage:', error);
    }
    return null;
  }

  /**
   * Cargar empresa guardada al iniciar
   */
  private cargarEmpresaGuardada(): void {
    const empresa = this.getEmpresaFromStorage();
    if (empresa) {
      this.empresaActualSubject.next(empresa);
    }
  }

  /**
   * Verificar si la caché es válida
   */
  private isCacheValid(): boolean {
    return (Date.now() - this.cacheTimestamp) < this.CACHE_DURATION;
  }

  /**
   * Empresa demo para desarrollo (cuando no hay backend)
   */
  private getEmpresaDemo(): Empresa {
    return {
      id: 'empresa-demo-001',
      nombre: 'Tech Solutions S.A.C.',
      ruc: '20601234567',
      direccion: 'Av. Principal 123, Lima - Perú',
      telefono: '(01) 123 4567',
      email: 'contacto@techsolutions.com',
      logo: 'https://via.placeholder.com/150x50?text=Tech+Solutions',
      plan: 'Premium',
      estado: 'Activo',
      fechaRegistro: new Date('2024-01-15'),
      configuracion: {
        maxTickets: 500,
        permiteAdjuntos: true,
        tiempoRespuesta: 24 // horas
      }
    };
  }

  /**
   * Limpiar empresa actual (logout)
   */
  logout(): void {
    this.empresaActualSubject.next(null);
    localStorage.removeItem('empresa_actual');
    localStorage.removeItem('token');
  }

  /**
   * Verificar si hay empresa seleccionada
   */
  hasEmpresaSeleccionada(): boolean {
    return this.empresaActualSubject.value !== null;
  }

  /**
   * Obtener el ID de la empresa actual (método síncrono)
   */
  getEmpresaActualId(): string | null {
    return this.empresaActualSubject.value?.id || null;
  }
}
