import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_URL } from './api.config';

export interface User {
  id: number;
  name: string;
  email: string;
  welcome_message?: string;
  login_count?: number;
  last_login_at?: string | null;
}

interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

const TOKEN_KEY = 'ufps_token';
const USER_KEY = 'ufps_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Signal reactivo con el usuario actual (o null si no hay sesión)
  readonly currentUser = signal<User | null>(this.loadUser());

  constructor(private http: HttpClient) {}

  register(name: string, email: string, password: string): Observable<{ message: string; user: User }> {
    return this.http.post<{ message: string; user: User }>(`${API_URL}/auth/register`, {
      name,
      email,
      password
    });
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/login`, { email, password }).pipe(
      tap((res) => {
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        this.currentUser.set(res.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
  }

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  updateStoredUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  private loadUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  }
}
