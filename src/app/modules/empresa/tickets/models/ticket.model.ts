import { Empresa } from '../../models/empresa.model'; // Ajusta la ruta según tu modelo real

export interface Ticket {
  id?: string;
  titulo: string;
  descripcion: string;
  prioridad: 'Baja' | 'Media' | 'Alta';
  estado: 'Abierto' | 'En proceso' | 'Cerrado';
  fechaCreacion: Date;
  empresaId: string;
  empresa?: Empresa;
  creadoPor?: string;
  creadoPorNombre?: string;
}
