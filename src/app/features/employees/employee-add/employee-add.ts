import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './employee-add.html',
  styleUrl: './employee-add.css'
})
export class EmployeeAddComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly employeeService = inject(EmployeeService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly employeeForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    salary: [0, [Validators.required, Validators.min(0)]]
  });

  saveEmployee(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.employeeService.addEmployee(this.employeeForm.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        void this.router.navigate(['/employees']);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Unable to add employee. Please try again.');
      }
    });
  }
}
