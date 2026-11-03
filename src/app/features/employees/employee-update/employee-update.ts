import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-employee-update',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './employee-update.html',
  styleUrl: './employee-update.css'
})
export class EmployeeUpdateComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);
  private readonly employeeService = inject(EmployeeService);
  private readonly router = inject(Router);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly employeeLoaded = signal(false);
  readonly errorMessage = signal('');
  private employeeId: number | null = null;

  readonly employeeForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    salary: [0, [Validators.required, Validators.min(0)]]
  });

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
        this.employeeForm.patchValue({
          name: employee.name,
          email: employee.email,
          salary: employee.salary
        });
        this.employeeLoaded.set(true);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Unable to load employee details. Please try again.');
      }
    });
  }

  updateEmployee(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    if (this.employeeId === null) {
      this.errorMessage.set('Invalid employee ID.');
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');

    this.employeeService
      .updateEmployee(this.employeeId, this.employeeForm.getRawValue())
      .subscribe({
        next: () => {
          this.saving.set(false);
          void this.router.navigate(['/employees']);
        },
        error: () => {
          this.saving.set(false);
          this.errorMessage.set('Unable to update employee. Please try again.');
        }
      });
  }
}
