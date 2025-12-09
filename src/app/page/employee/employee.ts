import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,FormsModule],
  templateUrl: './employee.html',
  styleUrls: ['./employee.css']
})
export class EmployeeComponent implements OnInit {

  showForm: boolean = false;
  employeeForm!: FormGroup;
  employees: any[] = [];
  filteredEmployees: any[] = []; // ✅ Add filtered list for search

  searchText: string = ''; // ✅ For binding search input

  parentDepartments = ["IT", "HR", "Sales"];
  childDepartments = ["Team A", "Team B", "Team C"];

  apiUrl = "http://localhost:3000/api";

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadEmployees();
  }

  // Initialize Reactive Form
  initForm() {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      contact: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      parentDept: ['', Validators.required],
      childDept: ['', Validators.required],
      password: ['', Validators.required],
      gender: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  // Show Add Employee Form
  showAddForm() {
    this.showForm = true;
  }

  // Close Form
  closeForm() {
    this.showForm = false;
    this.employeeForm.reset();
  }

  // Save Employee
  saveEmployee() {
    if (this.employeeForm.invalid) {
      alert("Fill all required fields!");
      return;
    }

    this.http.post(`${this.apiUrl}/employee`, this.employeeForm.value)
      .subscribe({
        next: (res) => {
          console.log("Employee saved:", res);
          alert("Employee saved successfully!");
          this.closeForm();
          this.loadEmployees(); // reload table
        },
        error: (err) => {
          console.error("Error saving employee:", err);
          alert("Error while saving employee");
        }
      });
  }

  // Load Employees
  loadEmployees() {
    this.http.get(`${this.apiUrl}/employee`).subscribe({
      next: (res: any) => {
        this.employees = Array.isArray(res) ? res : res.data || [];
        this.filteredEmployees = [...this.employees]; // ✅ initialize filtered list
        console.log("Employees loaded:", this.employees);
        this.cdr.detectChanges(); // ✅ Force view update immediately
      },
      error: (err) => {
        console.error("Error fetching employees:", err);
        this.employees = [];
        this.filteredEmployees = [];
      }
    });
  }

  // Delete Employee
  deleteEmployee(id: string) {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    this.http.delete(`${this.apiUrl}/employee/${id}`).subscribe({
      next: () => {
        alert("Employee deleted successfully!");
        this.loadEmployees(); // refresh table
      },
      error: (err) => {
        console.error("Error deleting employee:", err);
        alert("Error deleting employee");
      }
    });
  }

  // ===============================
  // ✅ SEARCH FUNCTIONALITY
  // ===============================
  filterEmployees() {
    const text = this.searchText.toLowerCase().trim();

    this.filteredEmployees = this.employees.filter(emp =>
      emp.name && emp.name.toLowerCase().includes(text)
    );
  }
}

