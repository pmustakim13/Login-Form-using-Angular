import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  login({ username, password }: any): Observable<any> {
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('token', 'mock-jwt-token-string');
      return of({ name: 'Admin User', email: 'admin@example.com' });
    }
    return throwError(() => new Error('Failed to login'));
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}