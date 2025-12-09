import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './project.html',
  styleUrls: ['./project.css']
})
export class ProjectComponent implements OnInit {

  showForm = false;
  projectForm!: FormGroup;
  projects: any[] = [];
  filteredProjects: any[] = []; // ✅ For search
  employees: any[] = []; // for leadBy dropdown
  editingId: string | null = null;

  searchText: string = ''; // ✅ For search input

  apiUrl = 'http://localhost:3000/api';

  constructor(private fb: FormBuilder, private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.initForm();
    this.loadEmployees();
    this.loadProjects();
  }

  initForm() {
    this.projectForm = this.fb.group({
      projectName: ['', Validators.required],
      clientName: ['', Validators.required],
      startDate: ['', Validators.required],
      leadBy: ['', Validators.required]
    });
  }

  newProject() {
    this.showForm = true;
    this.editingId = null;
    this.projectForm.reset();
  }

  editProject(id: string) {
    const proj = this.projects.find(p => p._id === id);
    if (!proj) return;
    this.projectForm.patchValue(proj);
    this.showForm = true;
    this.editingId = id;
  }

  closeForm() {
    this.showForm = false;
    this.projectForm.reset();
    this.editingId = null;
  }

  saveProject() {
    if (this.projectForm.invalid) {
      alert('Fill all required fields!');
      return;
    }

    if (this.editingId) {
      // Update
      this.http.put(`${this.apiUrl}/project/${this.editingId}`, this.projectForm.value).subscribe({
        next: () => {
          alert('Project updated!');
          this.closeForm();
          this.loadProjects();
        },
        error: (err) => console.error(err)
      });
    } else {
      // Add
      this.http.post(`${this.apiUrl}/project`, this.projectForm.value).subscribe({
        next: () => {
          alert('Project added!');
          this.closeForm();
          this.loadProjects();
        },
        error: (err) => console.error(err)
      });
    }
  }

  loadProjects() {
    this.http.get(`${this.apiUrl}/project`).subscribe({
      next: (res: any) => {
        this.projects = Array.isArray(res) ? res : res.data || [];
        this.filteredProjects = [...this.projects]; // ✅ initialize filtered list
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  loadEmployees() {
    this.http.get(`${this.apiUrl}/employee`).subscribe({
      next: (res: any) => {
        this.employees = Array.isArray(res) ? res : [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  deleteProject(id: string) {
    if (!confirm('Are you sure?')) return;
    this.http.delete(`${this.apiUrl}/project/${id}`).subscribe({
      next: () => this.loadProjects(),
      error: (err) => console.error(err)
    });
  }

  // ===============================
  // SEARCH FUNCTIONALITY (BY PROJECT NAME)
  // ===============================
  filterProjects() {
    const text = this.searchText.toLowerCase().trim();
    this.filteredProjects = this.projects.filter(proj =>
      proj.projectName && proj.projectName.toLowerCase().includes(text)
    );
  }
}
