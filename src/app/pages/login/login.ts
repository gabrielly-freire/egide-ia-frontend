import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { landingRouteFor } from '../../services/auth/role-routes';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  readonly showPassword = signal(false);
  readonly loading = signal(false);
  readonly authError = signal<string | null>(null);

  readonly loginForm;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {
    this.loginForm = this.fb.nonNullable.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    if (this.authService.hasToken()) {
      this.authService.restoreSession().subscribe(user => {
        if (user) {
          this.router.navigateByUrl(landingRouteFor(user.role));
        }
      });
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(value => !value);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.authError.set(null);

    this.authService
      .login({
        username: this.loginForm.controls.username.value,
        password: this.loginForm.controls.password.value
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: user => {
          this.router.navigateByUrl(landingRouteFor(user.role));
        },
        error: (error: Error) => {
          this.authError.set(error.message);
        }
      });
  }
}
