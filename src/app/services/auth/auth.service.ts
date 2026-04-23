import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, switchMap, tap, throwError } from 'rxjs';
import {
  AuthenticatedUserDTO,
  LoginRequestDTO,
  LoginResponseDTO
} from '../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authBaseUrl = '/api/v1/auth';
  private readonly tokenStorageKey = 'egide.auth.token';
  private readonly tokenTypeStorageKey = 'egide.auth.token_type';

  private readonly tokenState = signal<string | null>(null);
  readonly currentUser = signal<AuthenticatedUserDTO | null>(null);
  readonly isAuthenticated = computed(() => !!this.tokenState());

  constructor(private readonly http: HttpClient) {
    const savedToken = localStorage.getItem(this.tokenStorageKey);
    if (savedToken) {
      this.tokenState.set(savedToken);
    }
  }

  login(credentials: LoginRequestDTO): Observable<AuthenticatedUserDTO> {
    return this.http
      .post<LoginResponseDTO>(`${this.authBaseUrl}/login`, credentials)
      .pipe(
        tap(response => this.setSession(response)),
        switchMap(() => this.fetchCurrentUser()),
        catchError(error => this.handleAuthError(error))
      );
  }

  fetchCurrentUser(): Observable<AuthenticatedUserDTO> {
    return this.http.get<AuthenticatedUserDTO>(`${this.authBaseUrl}/me`).pipe(
      tap(user => this.currentUser.set(user))
    );
  }

  restoreSession(): Observable<AuthenticatedUserDTO | null> {
    if (!this.hasToken()) {
      return of(null);
    }

    if (this.currentUser()) {
      return of(this.currentUser());
    }

    return this.fetchCurrentUser().pipe(
      map(user => user),
      catchError(() => {
        this.clearSession();
        return of(null);
      })
    );
  }

  logout(): void {
    this.clearSession();
  }

  hasToken(): boolean {
    return !!this.tokenState();
  }

  getToken(): string | null {
    return this.tokenState();
  }

  private setSession(response: LoginResponseDTO): void {
    this.tokenState.set(response.token);
    localStorage.setItem(this.tokenStorageKey, response.token);
    localStorage.setItem(this.tokenTypeStorageKey, response.tokenType || 'Bearer');
  }

  private clearSession(): void {
    this.tokenState.set(null);
    this.currentUser.set(null);
    localStorage.removeItem(this.tokenStorageKey);
    localStorage.removeItem(this.tokenTypeStorageKey);
  }

  private handleAuthError(error: unknown): Observable<never> {
    const fallbackMessage = 'Falha na autenticacao. Verifique usuario e senha.';
    const apiMessage = (error as any)?.error?.message;
    const message = typeof apiMessage === 'string' ? apiMessage : fallbackMessage;
    return throwError(() => new Error(message));
  }
}
