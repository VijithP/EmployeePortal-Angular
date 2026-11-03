import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import {
  Employee,
  EmployeeService
} from '../../../core/services/employee.service';

@Component({
  selector: 'app-employee-delete',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './employee-delete.html',
  styleUrl: './employee-delete.css'
})
export class EmployeeDeleteComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly employeeService = inject(EmployeeService);
  private readonly router = inject(Router);

  readonly employee = signal<Employee | null>(null);
  readonly loading = signal(true);
  readonly deleting = signal(false);
  readonly errorMessage = signal('');
  private employeeId: number | null = null;

  ngOnInit(): void {
    const employeeId = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(employeeId) || employeeId < 1) {
      this.loading.set(false);
      this.errorMessage.set('Invalid employee ID.');
      return;
    }

    this.employeeId = employeeId;
    this.employeeService.getEmployee(employeeId).subscribe({
      next: employee => {
        this.employee.set(employee);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Unable to load employee details. Please try again.');
      }
    });
  }

  deleteEmployee(): void {
    if (this.employeeId === null || !this.employee()) {
      this.errorMessage.set('Employee details are unavailable.');
      return;
    }

    this.deleting.set(true);
    this.errorMessage.set('');

    this.employeeService.deleteEmployee(this.employeeId).subscribe({
      next: () => {
        this.deleting.set(false);
        void this.router.navigate(['/employees']);
      },
      error: () => {
        this.deleting.set(false);
        this.errorMessage.set('Unable to delete employee. Please try again.');
      }
    });
  }
}
