import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ExpenseService } from '../../services/expense';
import { AuthService } from '../../services/auth';

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
export class ExpenseFormComponent implements OnInit {

  title = '';
  amount: any = '';
  category = '';
  description = '';
  date = new Date();
  isLoading = false;
  isEditMode = false;
  isDeleteModalOpen = false;
  expenseId = '';
  errorMessage = '';
  successMessage = '';

  categories = [
    { value: 'Food',      icon: '🍔', color: '#ff7043' },
    { value: 'Transport', icon: '🚗', color: '#42a5f5' },
    { value: 'Shopping',  icon: '🛍️', color: '#ab47bc' },
    { value: 'Bills',     icon: '📄', color: '#ef5350' },
    { value: 'Health',    icon: '💊', color: '#26a69a' },
    { value: 'Education', icon: '📚', color: '#5c6bc0' },
    { value: 'Other',     icon: '📦', color: '#78909c' }
  ];

  constructor(
    private expenseService: ExpenseService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.expenseId = this.route.snapshot.params['id'];
    if (this.expenseId) {
      this.isEditMode = true;
      this.loadExpense();
    }
  }

  loadExpense() {
    this.isLoading = true;
    this.expenseService.getExpense(this.expenseId).subscribe({
      next: (res: any) => {
        const e = res.expense;
        this.title = e.title;
        this.amount = e.amount;
        this.category = e.category;
        this.description = e.description;
        this.date = new Date(e.date);
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load expense';
        this.isLoading = false;
      }
    });
  }

  getSelectedCategory() {
    return this.categories.find(c => c.value === this.category);
  }

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

    if (this.isEditMode) {
      this.expenseService.updateExpense(this.expenseId, expenseData).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Expense updated successfully!';
          setTimeout(() => this.router.navigate(['/expenses']), 1500);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error.message || 'Failed to update expense';
        }
      });
    } else {
      this.expenseService.createExpense(expenseData).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Expense added successfully!';
          setTimeout(() => this.router.navigate(['/expenses']), 1500);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error.message || 'Failed to add expense';
        }
      });
    }
  }

  openDeleteModal() {
    this.errorMessage = '';
    this.successMessage = '';
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
  }

  confirmDeleteExpense() {
    if (!this.expenseId) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.expenseService.deleteExpense(this.expenseId).subscribe({
      next: () => {
        this.isLoading = false;
        this.isDeleteModalOpen = false;
        this.successMessage = 'Expense deleted successfully!';
        setTimeout(() => this.router.navigate(['/expenses']), 1000);
      },
      error: (err) => {
        this.isLoading = false;
        this.isDeleteModalOpen = false;
        this.errorMessage = err.error.message || 'Failed to delete expense';
      }
    });
  }

  logout() {
    this.authService.logout();
  }

}
