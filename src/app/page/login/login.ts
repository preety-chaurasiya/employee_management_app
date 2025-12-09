import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  email = '';
  password = '';
  errorMsg = '';
  isLocked = false;
  attempts = 0;

  lockDuration = 15 * 60 * 1000; // 15 minutes in ms
  remainingTime = 0;
  timerInterval: any;

  apiUrl = 'http://localhost:3000/api';

  constructor(
    private router: Router,
    private http: HttpClient,
    private auth: AuthService
  ) {
    this.restoreLockState();
  }

  // Restore lock state from localStorage
  restoreLockState() {
    const lockEnd = localStorage.getItem('lockEndTime');

    if (lockEnd) {
      const endTime = parseInt(lockEnd);

      if (Date.now() < endTime) {
        this.startLock(endTime - Date.now());
      } else {
        localStorage.removeItem('lockEndTime');
      }
    }
  }

  startLock(duration: number) {
    this.isLocked = true;
    this.remainingTime = duration;

    this.timerInterval = setInterval(() => {
      this.remainingTime -= 1000;

      if (this.remainingTime <= 0) {
        clearInterval(this.timerInterval);
        this.isLocked = false;
        this.attempts = 0;
        localStorage.removeItem('lockEndTime');
      }
    }, 1000);
  }

  async login(form: NgForm) {
    if (this.isLocked) return;

    if (!form.valid) {
      this.errorMsg = "Please enter valid email & password!";
      return;
    }

    this.errorMsg = "";

    try {
      const res: any = await this.http
        .post(`${this.apiUrl}/login`, {
          email: this.email,
          password: this.password
        })
        .toPromise();

      // Reset attempts on success
      this.attempts = 0;
      localStorage.removeItem('lockEndTime');

      this.auth.setLoginState(true);
      this.router.navigate(['/layout/dashboard']);

    } catch (error: any) {
      this.attempts++;

      if (error.status === 401) {
        this.errorMsg = "Incorrect email or password!";
      } else {
        this.errorMsg = "Server error. Try again.";
      }

      // Lock after 3 failed attempts
      if (this.attempts >= 3) {
        const lockEnd = Date.now() + this.lockDuration;
        localStorage.setItem('lockEndTime', lockEnd.toString());

        this.startLock(this.lockDuration);
        this.errorMsg = "Too many failed attempts. Login locked for 15 minutes.";
      }
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
