import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  // Register
  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // Login
  login(data: any) {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  // Save token
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  // Get token
  getToken() {
    return localStorage.getItem('token');
  }

  // Check if logged in
  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  // Logout
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}