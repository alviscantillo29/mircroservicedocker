import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-wrapper">
      <div class="card">
        <h1>Crear cuenta</h1>
        <p class="subtitle">Regístrate para acceder al dashboard</p>

        <div class="alert error" *ngIf="error">{{ error }}</div>
        <div class="alert success" *ngIf="success">{{ success }}</div>

        <form (ngSubmit)="onSubmit()">
          <label for="name">Nombre</label>
          <input id="name" type="text" name="name" [(ngModel)]="name" required />

          <label for="email">Email</label>
          <input id="email" type="email" name="email" [(ngModel)]="email" required />

          <label for="password">Contraseña (mín. 6 caracteres)</label>
          <input id="password" type="password" name="password" [(ngModel)]="password" required />

          <button type="submit" [disabled]="loading">
            {{ loading ? 'Registrando...' : 'Registrarme' }}
          </button>
        </form>

        <p class="link">¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión</a></p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  loading = false;
  error = '';
  success = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.error = '';
    this.success = '';
    this.loading = true;
    this.auth.register(this.name, this.email, this.password).subscribe({
      next: () => {
        this.success = 'Cuenta creada. Redirigiendo al login...';
        setTimeout(() => this.router.navigate(['/login']), 1200);
      },
      error: (err) => {
        this.error = err?.error?.error || 'No se pudo registrar.';
        this.loading = false;
      }
    });
  }
}
