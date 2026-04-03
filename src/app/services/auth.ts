import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  id: number;
  email: string;
  role: 'empresa' | 'especialista' | 'admin';
  name: string;
}

// Interfaz interna para los usuarios de prueba (incluye password)
interface TestUser extends User {
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Usamos signals para reactividad (moderno en Angular)
  private currentUserSignal = signal<User | null>(null);
  public currentUser = this.currentUserSignal.asReadonly();

  // Usuarios de prueba (incluyen password)
  private testUsers: TestUser[] = [
    { id: 1, email: 'empresa@test.com', password: '1234', role: 'empresa', name: 'Empresa Demo' },
    { id: 2, email: 'especialista@test.com', password: '1234', role: 'especialista', name: 'Juan Pérez' },
    { id: 3, email: 'admin@test.com', password: '1234', role: 'admin', name: 'Admin Sistema' }
  ];

  constructor(private router: Router) {
    // Al iniciar, verificar si hay sesión guardada
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSignal.set(JSON.parse(storedUser));
    }
  }

  // Simula login con credenciales predefinidas
  login(email: string, password: string): boolean {
    // Buscar usuario por email y password
    const testUser = this.testUsers.find(u => u.email === email && u.password === password);

    if (testUser) {
      // Crear objeto User sin password para almacenar
      const user: User = {
        id: testUser.id,
        email: testUser.email,
        role: testUser.role,
        name: testUser.name
      };

      this.currentUserSignal.set(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.currentUserSignal() !== null;
  }

  getRole(): string | null {
    return this.currentUserSignal()?.role || null;
  }
}
