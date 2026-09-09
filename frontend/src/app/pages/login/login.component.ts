import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-wrapper">
      <div class="card">
        <h1>Iniciar sesión</h1>
        <p class="subtitle">Ingresa tus credenciales para continuar</p>

        <div class="alert error" *ngIf="error">{{ error }}</div>

        <form (ngSubmit)="onSubmit()">
          <label for="email">Email</label>
          <input id="email" type="email" name="email" [(ngModel)]="email" required />

          <label for="password">Contraseña</label>
          <input id="password" type="password" name="password" [(ngModel)]="password" required />

          <button type="submit" [disabled]="loading">
            {{ loading ? 'Ingresando...' : 'Ingresar' }}
          </button>
        </form>

        <p class="link">¿No tienes cuenta? <a routerLink="/register">Regístrate</a></p>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.error = '';
    this.loading = true;
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.error = err?.error?.error || 'No se pudo iniciar sesión.';
        this.loading = false;
      }
    });
  }
}
