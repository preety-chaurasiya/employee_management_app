import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-employee',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './project-employees.html',
  styleUrls: ['./project-employees.css']
})
export class ProjectEmployeeComponent implements OnInit {

  projectEmployees: any[] = [];
  employees: any[] = [];
  projects: any[] = [];

  // ❌ REMOVE empProjectId from formData — backend generates it
  formData = {
    projectId: '',
    employeeId: '',
    assignedDate: '',
    role: ''
  };

  apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadProjects();
    this.loadEmployees();
    this.loadData();
  }

  loadEmployees() {
    this.http.get(`${this.apiUrl}/employee`).subscribe({
      next: (res: any) => {
        this.employees = Array.isArray(res) ? res : [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading employees:', err)
    });
  }

  loadProjects() {
    this.http.get(`${this.apiUrl}/project`).subscribe({
      next: (res: any) => {
        this.projects = Array.isArray(res) ? res : [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading projects:', err)
    });
  }

  loadData() {
    this.http.get(`${this.apiUrl}/projectEmployee`).subscribe({
      next: (res: any) => {
        this.projectEmployees = Array.isArray(res) ? res : [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading project employees:', err)
    });
  }

  // ======================
  // Submit form
  // ======================
  submitForm(f: NgForm) {
    if (!f.valid) {
      alert('Please fill all fields');
      return;
    }

    // create payload WITHOUT empProjectId
    const payload = {
      projectId: this.formData.projectId,
      employeeId: this.formData.employeeId,
      assignedDate: this.formData.assignedDate,
      role: this.formData.role
    };

    this.http.post(`${this.apiUrl}/projectEmployee`, payload)
      .subscribe({
        next: () => {
          alert('Added successfully');
          this.loadData();  // reload to show backend-generated id
          this.resetForm();
        },
        error: (err) => console.error('Error adding record:', err)
      });
  }

  edit(empProjectId: string) {
    const record = this.projectEmployees.find(p => p.empProjectId === empProjectId);
    if (record) {
      this.formData = {
        projectId: record.projectId,
        employeeId: record.employeeId,
        assignedDate: record.assignedDate,
        role: record.role
      };
    }
  }

  delete(empProjectId: string) {
    if (!confirm('Are you sure?')) return;

    this.http.delete(`${this.apiUrl}/projectEmployee/${empProjectId}`)
      .subscribe({
        next: () => {
          this.projectEmployees = this.projectEmployees.filter(p => p.empProjectId !== empProjectId);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error deleting record:', err)
      });
  }

  resetForm() {
    this.formData = {
      projectId: '',
      employeeId: '',
      assignedDate: '',
      role: ''
    };
  }
}
