import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';

export interface Employee {
  id: number;
  name: string;
  email: string;
  salary: number;
}

export type NewEmployee = Omit<Employee, 'id'>;

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly http = inject(HttpClient);

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${API_BASE_URL}/employees`);
  }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${API_BASE_URL}/employees/${id}`);
  }

  addEmployee(employee: NewEmployee): Observable<Employee> {
    return this.http.post<Employee>(`${API_BASE_URL}/employees`, employee);
  }

  updateEmployee(id: number, employee: NewEmployee): Observable<Employee> {
    return this.http.put<Employee>(`${API_BASE_URL}/employees/${id}`, employee);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/employees/${id}`);
  }
}
