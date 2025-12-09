import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  totalEmployees = 0;
  totalProjects = 0;
  activeEmployees = 0;

  apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef   // 👈 added
  ) {}

  ngOnInit() {
    this.loadCounts();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.loadCounts());
  }

  loadCounts() {
    this.http.get(`${this.apiUrl}/dashboard/counts`)
      .subscribe({
        next: (res: any) => {
          this.totalEmployees = res.totalEmployees;
          this.totalProjects = res.totalProjects;
          this.activeEmployees = res.activeEmployees;

          this.cdr.detectChanges();   // 🔥 force UI update
        },
        error: (err) => console.error(err)
      });
  }
}
