import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { API_BASE_URL } from '../../../core/config/api.config';

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
}

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css'
})
export class EmployeeListComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  employees = signal<Employee[]>([]);
  searchTerm = signal('');
  loading = signal(false);
  errorMessage = signal('');
  filteredEmployees = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();

    if (!query) {
      return this.employees();
    }

    return this.employees().filter(employee =>
      `${employee.firstName} ${employee.lastName} ${employee.email} ${employee.department}`
        .toLowerCase()
        .includes(query)
    );
  });

  ngOnInit(): void {
    this.loadEmployees();
  }

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

  initials(employee: Employee): string {
    return `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`.toUpperCase();
  }

  updateSearch(event: Event): void {
    if (event.target instanceof HTMLInputElement) {
      this.searchTerm.set(event.target.value);
    }
  }

  logout(): void {
    this.authService.logout();
  }
}