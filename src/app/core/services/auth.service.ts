import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { Router } from '@angular/router';
import { API_BASE_URL } from '../config/api.config';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresAtUtc: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${API_BASE_URL}/auth/login`, request)
      .pipe(
        tap(response => {
          const storage = this.browserStorage;
          storage?.setItem('access_token', response.accessToken);
          storage?.setItem('token_expires_at', response.expiresAtUtc);
        })
      );
  }

  getAccessToken(): string | null {
    return this.browserStorage?.getItem('access_token') ?? null;
  }

  isAuthenticated(): boolean {
    const storage = this.browserStorage;
    if (!storage) {
      return false;
    }

    const token = this.getAccessToken();
    const expiresAt = storage.getItem('token_expires_at');

    if (!token || !expiresAt) {
      return false;
    }

    return new Date(expiresAt).getTime() > Date.now();
  }

  logout(): void {
    this.browserStorage?.removeItem('access_token');
    this.browserStorage?.removeItem('token_expires_at');

    void this.router.navigate(['/login']);
  }

  private get browserStorage(): Storage | null {
    return isPlatformBrowser(this.platformId) ? sessionStorage : null;
  }
}