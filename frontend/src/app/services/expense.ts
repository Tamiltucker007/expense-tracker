import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private apiUrl = `${environment.apiUrl}/expenses`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Get headers with token
  private getHeaders() {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  // Get all expenses
  getExpenses() {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  // Get single expense
  getExpense(id: string) {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Create expense
  createExpense(data: any) {
    return this.http.post(this.apiUrl, data, { headers: this.getHeaders() });
  }

  // Update expense
  updateExpense(id: string, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data, { headers: this.getHeaders() });
  }

  // Delete expense
  deleteExpense(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

}