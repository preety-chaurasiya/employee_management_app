import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {

  constructor(private router: Router) {}

  goToRegister() {
    this.router.navigate(['/register']);
  }

   goToLogin() {
    this.router.navigate(['/login']);
  }
}
