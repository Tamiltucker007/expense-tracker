import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { ExpenseService } from '../../services/expense';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatChipsModule
  ],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.css'
})
export class ExpenseListComponent implements OnInit {

  expenses: any[] = [];
  isLoading = true;
  errorMessage = '';
  isDeleteModalOpen = false;
  isDeleting = false;
  selectedExpenseId = '';
  selectedExpenseTitle = '';
  selectedExpenseAmount = 0;

  displayedColumns = ['title', 'category', 'amount', 'date', 'description', 'actions'];

  categoryIcons: any = {
    'Food': '🍔',
    'Transport': '🚗',
    'Shopping': '🛍️',
    'Bills': '📄',
    'Health': '💊',
    'Education': '📚',
    'Other': '📦'
  };

  categoryColors: any = {
    'Food': '#ff7043',
    'Transport': '#42a5f5',
    'Shopping': '#ab47bc',
    'Bills': '#ef5350',
    'Health': '#26a69a',
    'Education': '#5c6bc0',
    'Other': '#78909c'
  };

  constructor(
    private expenseService: ExpenseService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadExpenses();
  }

  loadExpenses() {
    this.isLoading = true;
    this.expenseService.getExpenses().subscribe({
      next: (res: any) => {
        this.expenses = res.expenses;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load expenses';
        this.isLoading = false;
      }
    });
  }

  getTotalAmount(): number {
    return this.expenses.reduce((sum, e) => sum + e.amount, 0);
  }

  openDeleteModal(expense: any) {
    this.selectedExpenseId = expense._id;
    this.selectedExpenseTitle = expense.title;
    this.selectedExpenseAmount = expense.amount;
    this.errorMessage = '';
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    if (this.isDeleting) return;

    this.isDeleteModalOpen = false;
    this.selectedExpenseId = '';
    this.selectedExpenseTitle = '';
    this.selectedExpenseAmount = 0;
  }

  confirmDeleteExpense() {
    if (!this.selectedExpenseId) return;

    this.isDeleting = true;
    this.errorMessage = '';

    this.expenseService.deleteExpense(this.selectedExpenseId).subscribe({
      next: () => {
        this.expenses = this.expenses.filter(e => e._id !== this.selectedExpenseId);
        this.isDeleting = false;
        this.closeDeleteModal();
      },
      error: (err) => {
        this.isDeleting = false;
        this.errorMessage = err.error?.message || 'Failed to delete expense';
      }
    });
  }

  logout() {
    this.authService.logout();
  }

}
