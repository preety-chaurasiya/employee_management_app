import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = false;

  setLoginState(state: boolean) {
    this.loggedIn = state;
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }
}
