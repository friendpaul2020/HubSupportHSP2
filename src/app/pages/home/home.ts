import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container">
      <!-- Navbar -->
      <nav class="navbar">
        <div class="nav-content">
          <div class="logo">
            <i class="pi pi-ticket"></i>
            <span>TicketHub</span>
          </div>
          <div class="nav-links">
            <a href="#features">Características</a>
            <a href="#about">Acerca de</a>
            <a href="#contact">Contacto</a>
            <button class="btn-login" (click)="irALogin()">Iniciar Sesión</button>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1 class="hero-title">
            Gestión de Tickets
            <span class="gradient-text">Inteligente y Simple</span>
          </h1>
          <p class="hero-description">
            Centraliza, organiza y resuelve tus tickets de soporte de manera eficiente.
            La solución perfecta para empresas, especialistas y administradores.
          </p>
          <div class="hero-buttons">
            <button class="btn-primary" (click)="irALogin()">
              Comenzar Ahora
              <i class="pi pi-arrow-right"></i>
            </button>
            <button class="btn-secondary" (click)="verDemo()">
              Ver Demo
              <i class="pi pi-play"></i>
            </button>
          </div>
        </div>
        <div class="hero-image">
          <div class="dashboard-preview">
            <div class="preview-card">
              <div class="preview-header">
                <div class="preview-dots">
                  <span></span><span></span><span></span>
                </div>
                <span>Dashboard</span>
              </div>
              <div class="preview-stats">
                <div class="stat"></div>
                <div class="stat"></div>
                <div class="stat"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" class="features">
        <h2 class="section-title">¿Por qué elegirnos?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🚀</div>
            <h3>Rápido y Eficiente</h3>
            <p>Gestiona tus tickets en segundos con una interfaz intuitiva y responsive</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔒</div>
            <h3>Seguro y Confiable</h3>
            <p>Tus datos están protegidos con autenticación segura y encriptación</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Estadísticas en Tiempo Real</h3>
            <p>Visualiza métricas y KPIs con gráficas interactivas y reportes</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">👥</div>
            <h3>Múltiples Roles</h3>
            <p>Empresas, especialistas y administradores con vistas personalizadas</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3>Responsive Design</h3>
            <p>Accede desde cualquier dispositivo: desktop, tablet o móvil</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔄</div>
            <h3>Sincronización en Vivo</h3>
            <p>Actualizaciones en tiempo real de todos los tickets y cambios</p>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="stats">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">1000+</div>
            <div class="stat-label">Tickets Resueltos</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">98%</div>
            <div class="stat-label">Satisfacción</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">24/7</div>
            <div class="stat-label">Soporte</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">50+</div>
            <div class="stat-label">Empresas</div>
          </div>
        </div>
      </section>

      <!-- Roles Section -->
      <section class="roles">
        <h2 class="section-title">Diseñado para cada rol</h2>
        <div class="roles-grid">
          <div class="role-card">
            <div class="role-icon">🏢</div>
            <h3>Empresas</h3>
            <p>Gestiona tus tickets, visualiza el progreso y comunícate con especialistas</p>
            <ul>
              <li>✓ Crear tickets</li>
              <li>✓ Seguimiento en tiempo real</li>
              <li>✓ Historial completo</li>
            </ul>
          </div>
          <div class="role-card">
            <div class="role-icon">👨‍💻</div>
            <h3>Especialistas</h3>
            <p>Asigna, resuelve y da seguimiento a los tickets asignados a tu equipo</p>
            <ul>
              <li>✓ Bandeja de tickets</li>
              <li>✓ Actualizar estados</li>
              <li>✓ Comunicación directa</li>
            </ul>
          </div>
          <div class="role-card">
            <div class="role-icon">👑</div>
            <h3>Administradores</h3>
            <p>Control total del sistema, usuarios y estadísticas globales</p>
            <ul>
              <li>✓ Gestión de usuarios</li>
              <li>✓ Reportes globales</li>
              <li>✓ Configuración del sistema</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta">
        <div class="cta-content">
          <h2>¿Listo para optimizar tu soporte?</h2>
          <p>Únete a cientos de empresas que ya confían en TicketHub</p>
          <button class="btn-primary btn-large" (click)="irALogin()">
            Comenzar Gratis
            <i class="pi pi-arrow-right"></i>
          </button>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-content">
          <div class="footer-section">
            <h4>TicketHub</h4>
            <p>Sistema de gestión de tickets moderno y eficiente</p>
          </div>
          <div class="footer-section">
            <h4>Enlaces Rápidos</h4>
            <a href="#features">Características</a>
            <a href="#about">Acerca de</a>
            <a href="#contact">Contacto</a>
          </div>
          <div class="footer-section">
            <h4>Contacto</h4>
            <p>📧 soporte@tickethub.com</p>
            <p>📞 +56 2 1234 5678</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2025 TicketHub. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .home-container {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      overflow-x: hidden;
    }

    /* Navbar */
    .navbar {
      position: fixed;
      top: 0;
      width: 100%;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 1000;
    }

    .nav-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.5rem;
      font-weight: bold;
      color: #667eea;
    }

    .logo i {
      font-size: 1.8rem;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .nav-links a {
      text-decoration: none;
      color: #333;
      transition: color 0.3s;
    }

    .nav-links a:hover {
      color: #667eea;
    }

    .btn-login {
      background: #667eea;
      color: white;
      border: none;
      padding: 0.5rem 1.5rem;
      border-radius: 25px;
      cursor: pointer;
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .btn-login:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    /* Hero Section */
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1200px;
      margin: 0 auto;
      padding: 6rem 2rem;
      gap: 4rem;
    }

    .hero-content {
      flex: 1;
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 800;
      line-height: 1.2;
      margin-bottom: 1.5rem;
      color: white;
    }

    .gradient-text {
      background: linear-gradient(135deg, #FFD6E8 0%, #FFA6C9 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      display: block;
    }

    .hero-description {
      font-size: 1.2rem;
      color: rgba(255,255,255,0.9);
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .hero-buttons {
      display: flex;
      gap: 1rem;
    }

    .btn-primary, .btn-secondary {
      padding: 0.8rem 2rem;
      border: none;
      border-radius: 50px;
      font-size: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: transform 0.3s;
    }

    .btn-primary {
      background: white;
      color: #667eea;
      font-weight: bold;
    }

    .btn-secondary {
      background: rgba(255,255,255,0.2);
      color: white;
      backdrop-filter: blur(10px);
    }

    .btn-primary:hover, .btn-secondary:hover {
      transform: translateY(-3px);
    }

    .hero-image {
      flex: 1;
    }

    .dashboard-preview {
      background: white;
      border-radius: 20px;
      padding: 1rem;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }

    .preview-card {
      background: #f5f5f5;
      border-radius: 12px;
      padding: 1rem;
    }

    .preview-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .preview-dots {
      display: flex;
      gap: 0.3rem;
    }

    .preview-dots span {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #ddd;
    }

    .preview-stats {
      display: flex;
      gap: 0.5rem;
    }

    .stat {
      flex: 1;
      height: 60px;
      background: #e0e0e0;
      border-radius: 8px;
    }

    /* Features */
    .features, .roles, .cta, .stats {
      padding: 5rem 2rem;
      background: white;
    }

    .section-title {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 3rem;
      color: #333;
    }

    .features-grid, .roles-grid, .stats-grid {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .feature-card, .role-card {
      background: #f8f9fa;
      padding: 2rem;
      border-radius: 15px;
      text-align: center;
      transition: transform 0.3s;
    }

    .feature-card:hover, .role-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    .feature-icon, .role-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .role-card ul {
      list-style: none;
      text-align: left;
      margin-top: 1rem;
      padding-left: 0;
    }

    .role-card li {
      margin: 0.5rem 0;
      color: #666;
    }

    /* Stats */
    .stats {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      font-size: 3rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-size: 1.1rem;
      opacity: 0.9;
    }

    /* CTA */
    .cta {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
    }

    .cta-content h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .btn-large {
      padding: 1rem 2.5rem;
      font-size: 1.2rem;
      margin-top: 2rem;
      background: white;
      color: #667eea;
    }

    /* Footer */
    .footer {
      background: #1a1a2e;
      color: white;
      padding: 3rem 2rem 1rem;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .footer-section h4 {
      margin-bottom: 1rem;
    }

    .footer-section a {
      display: block;
      color: #ccc;
      text-decoration: none;
      margin: 0.5rem 0;
    }

    .footer-bottom {
      text-align: center;
      padding-top: 2rem;
      border-top: 1px solid #333;
      color: #ccc;
    }

    @media (max-width: 768px) {
      .hero {
        flex-direction: column;
        text-align: center;
        padding-top: 8rem;
      }

      .hero-title {
        font-size: 2.5rem;
      }

      .hero-buttons {
        justify-content: center;
      }

      .nav-links {
        display: none;
      }
    }
  `]
})
export class HomeComponent {
  constructor(private router: Router) {}

  irALogin() {
    this.router.navigate(['/login']);
  }

  verDemo() {
    // Mostrar demo o información
    alert('Demo disponible próximamente. Por favor inicia sesión para probar el sistema.');
  }
}
