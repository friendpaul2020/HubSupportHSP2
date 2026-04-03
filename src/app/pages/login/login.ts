import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Hub de Soporte - Login</h2>
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email:</label>
            <input type="email" [(ngModel)]="email" name="email" required class="form-control">
          </div>
          <div class="form-group">
            <label>Contraseña:</label>
            <input type="password" [(ngModel)]="password" name="password" required class="form-control">
          </div>
          <button type="submit" class="btn-primary">Ingresar</button>
          <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
        </form>
        <div class="demo-info">
          <p><strong>Cuentas demo:</strong></p>
          <p>📧 empresa@test.com / 1234</p>
          <p>📧 especialista@test.com / 1234</p>
          <p>📧 admin@test.com / 1234</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .login-card {
      background: white;
      padding: 2rem;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-control {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .btn-primary {
      width: 100%;
      padding: 0.75rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .error-message {
      color: red;
      margin-top: 1rem;
      text-align: center;
    }
    .demo-info {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
      font-size: 0.9rem;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.authService.login(this.email, this.password)) {
      const role = this.authService.getRole();
      // Redirigir según el rol
      switch(role) {
        case 'empresa':
          this.router.navigate(['/empresa']);
          break;
        case 'especialista':
          this.router.navigate(['/especialistas']);
          break;
        case 'admin':
          this.router.navigate(['/admin']);
          break;
        default:
          this.router.navigate(['/']);
      }
    } else {
      this.errorMessage = 'Credenciales inválidas';
    }
  }
}
