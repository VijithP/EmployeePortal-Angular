import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import {
  Employee,
  EmployeeService
} from '../../../core/services/employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css'
})
export class EmployeeListComponent implements OnInit {
  private readonly employeeService = inject(EmployeeService);
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
      `${employee.id} ${employee.name} ${employee.email} ${employee.salary}`
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

    this.employeeService.getEmployees().subscribe({
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
    return `${employee.name.charAt(0)}`.toUpperCase();
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