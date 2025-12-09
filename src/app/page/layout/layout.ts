import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class LayoutComponent {

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem("isLoggedIn");
    this.router.navigate(['/login']);
  }

}
