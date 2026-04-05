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

export interface EmpresaStats {
  totalUsuarios: number;
  totalTickets: number;
  ticketsAbiertos: number;
  ticketsCerrados: number;
  ticketsEnProceso: number;
  satisfaccion: number;
  ticketsPorPrioridad: {
    alta: number;
    media: number;
    baja: number;
  };
}
