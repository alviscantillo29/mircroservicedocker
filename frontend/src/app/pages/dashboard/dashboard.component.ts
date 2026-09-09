import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { DashboardService, LoggedUser } from '../../core/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  template: `
    <div class="dash">
      <header class="topbar">
        <div>
          <h1>Dashboard</h1>
          <p class="hi">Hola, <strong>{{ auth.currentUser()?.name }}</strong> 👋</p>
        </div>
        <button class="logout" (click)="logout()">Cerrar sesión</button>
      </header>

      <section class="panel">
        <h2>Tu mensaje de bienvenida</h2>
        <p class="muted">Escribe un mensaje personalizado y guárdalo.</p>

        <div class="alert success" *ngIf="saved">{{ saved }}</div>

        <textarea
          [(ngModel)]="welcomeMessage"
          rows="3"
          placeholder="Ej: ¡Bienvenido a mi aplicación de servicios web!"
        ></textarea>
        <button class="save" (click)="saveMessage()" [disabled]="saving">
          {{ saving ? 'Guardando...' : 'Guardar mensaje' }}
        </button>

        <div class="preview" *ngIf="welcomeMessage.trim()">
          <span class="preview-label">Vista previa:</span>
          <p>{{ welcomeMessage }}</p>
        </div>
      </section>

      <section class="panel">
        <h2>Usuarios que han iniciado sesión</h2>
        <p class="muted">Lista de usuarios con login exitoso, del más reciente al más antiguo.</p>

        <div class="alert error" *ngIf="error">{{ error }}</div>

        <table *ngIf="users.length; else empty">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Inicios</th>
              <th>Último acceso</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let u of users">
              <td>{{ u.name }}</td>
              <td>{{ u.email }}</td>
              <td class="center">{{ u.login_count }}</td>
              <td>{{ u.last_login_at + 'Z' | date: 'short' }}</td>
            </tr>
          </tbody>
        </table>
        <ng-template #empty><p class="muted">Aún no hay usuarios con sesión iniciada.</p></ng-template>
      </section>
    </div>
  `,
  styles: [
    `
      .dash { max-width: 900px; margin: 0 auto; padding: 1.5rem; }
      .topbar {
        display: flex; justify-content: space-between; align-items: center;
        background: #fff; border-radius: 14px; padding: 1.25rem 1.5rem; margin-bottom: 1.25rem;
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
      }
      .topbar h1 { margin: 0; font-size: 1.4rem; }
      .hi { margin: 0.25rem 0 0; color: #6b7280; }
      .logout { width: auto; background: #ef4444; padding: 0.55rem 1rem; }
      .logout:hover { background: #dc2626; }
      .panel {
        background: #fff; border-radius: 14px; padding: 1.5rem; margin-bottom: 1.25rem;
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
      }
      .panel h2 { margin: 0 0 0.25rem; font-size: 1.15rem; }
      .muted { color: #6b7280; font-size: 0.88rem; margin: 0 0 1rem; }
      .save { width: auto; padding: 0.6rem 1.25rem; }
      .preview {
        margin-top: 1rem; padding: 1rem; background: #f5f3ff;
        border-left: 4px solid #8b5cf6; border-radius: 8px;
      }
      .preview-label { font-size: 0.75rem; font-weight: 700; color: #7c3aed; text-transform: uppercase; }
      .preview p { margin: 0.35rem 0 0; font-size: 1.05rem; }
      table { width: 100%; border-collapse: collapse; }
      th, td { text-align: left; padding: 0.65rem 0.5rem; border-bottom: 1px solid #eee; font-size: 0.9rem; }
      th { color: #6b7280; font-size: 0.78rem; text-transform: uppercase; }
      .center { text-align: center; }
    `
  ]
})
export class DashboardComponent implements OnInit {
  users: LoggedUser[] = [];
  welcomeMessage = '';
  saving = false;
  saved = '';
  error = '';

  constructor(
    public auth: AuthService,
    private dashboard: DashboardService,
    private router: Router
  ) {}

  ngOnInit() {
    this.welcomeMessage = this.auth.currentUser()?.welcome_message || '';
    this.loadUsers();
  }

  loadUsers() {
    this.dashboard.getLoggedUsers().subscribe({
      next: (res) => (this.users = res.users),
      error: (err) => (this.error = err?.error?.error || 'No se pudo cargar la lista.')
    });
  }

  saveMessage() {
    this.saving = true;
    this.saved = '';
    this.dashboard.saveWelcomeMessage(this.welcomeMessage).subscribe({
      next: (res) => {
        const current = this.auth.currentUser();
        if (current) this.auth.updateStoredUser({ ...current, welcome_message: res.user.welcome_message });
        this.saved = '✅ Mensaje guardado correctamente.';
        this.saving = false;
      },
      error: (err) => {
        this.error = err?.error?.error || 'No se pudo guardar.';
        this.saving = false;
      }
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
