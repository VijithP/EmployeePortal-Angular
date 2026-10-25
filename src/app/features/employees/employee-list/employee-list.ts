import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { API_BASE_URL } from '../../../core/config/api.config';

interface Employee {
  id: number;
  name: string;
  department: string;
}

@Component({
  selector: 'app-employee-list',
  standalone: true,
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css'
})
export class EmployeeListComponent {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  employees = signal<Employee[]>([]);
  loading = signal(false);
  errorMessage = signal('');

  loadEmployees(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.http
      .get<Employee[]>(`${API_BASE_URL}/employees`)
      .subscribe({
        next: employees => {
          this.employees.set(employees);
          this.loading.set(false);
        },
        error: error => {
          this.loading.set(false);

          if (error.status === 401) {
            this.errorMessage.set(
              'Your session has expired. Please sign in again.'
            );
          } else if (error.status === 403) {
            this.errorMessage.set(
              'You do not have permission to access this resource.'
            );
          } else {
            this.errorMessage.set(
              'Unable to load employees. Please try again.'
            );
          }
        }
      });
  }

  logout(): void {
    this.authService.logout();
  }
}