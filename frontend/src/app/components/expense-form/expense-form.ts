import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ExpenseService } from '../../services/expense';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './expense-form.html',
  styleUrl: './expense-form.css'
})
export class ExpenseFormComponent {

  title = '';
  amount = '';
  category = '';
  description = '';
  date = new Date();
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  categories = [
    { value: 'Food', icon: '🍔' },
    { value: 'Transport', icon: '🚗' },
    { value: 'Shopping', icon: '🛍️' },
    { value: 'Bills', icon: '📄' },
    { value: 'Health', icon: '💊' },
    { value: 'Education', icon: '📚' },
    { value: 'Other', icon: '📦' }
  ];

  constructor(private expenseService: ExpenseService, private router: Router) {}

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const expenseData = {
      title: this.title,
      amount: this.amount,
      category: this.category,
      description: this.description,
      date: this.date
    };

    this.expenseService.createExpense(expenseData).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.successMessage = 'Expense added successfully!';
        setTimeout(() => {
          this.router.navigate(['/expenses']);
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error.message || 'Failed to add expense';
      }
    });
  }

}