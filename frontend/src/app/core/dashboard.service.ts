import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from './api.config';
import { User } from './auth.service';

export interface LoggedUser {
  id: number;
  name: string;
  email: string;
  login_count: number;
  last_login_at: string;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private http: HttpClient) {}

  getLoggedUsers(): Observable<{ users: LoggedUser[] }> {
    return this.http.get<{ users: LoggedUser[] }>(`${API_URL}/dashboard/logged-users`);
  }

  saveWelcomeMessage(message: string): Observable<{ message: string; user: User }> {
    return this.http.put<{ message: string; user: User }>(`${API_URL}/dashboard/welcome-message`, {
      message
    });
  }
}
