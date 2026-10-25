import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';

  loading = signal(false);
  errorMessage = signal('');

  login(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.loading.set(false);
        void this.router.navigate(['/employees']);
      },
      error: error => {
        this.loading.set(false);

        this.errorMessage.set(
          error.status === 401
            ? 'Invalid email or password.'
            : 'Unable to sign in. Please try again.'
        );
      }
    });
  }
}