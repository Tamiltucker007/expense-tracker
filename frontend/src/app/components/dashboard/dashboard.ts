import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth';
import { ExpenseService } from '../../services/expense';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  menuItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Expenses', icon: 'receipt_long', route: '/expenses' },
    { label: 'Add Expense', icon: 'add_circle', route: '/expenses/add' },
  ];

  categoryIcons: Record<string, string> = {
    Food: '🍔',
    Transport: '🚗',
    Shopping: '🛍️',
    Bills: '📄',
    Health: '💊',
    Education: '📚',
    Other: '📦'
  };

  expenses: any[] = [];
  recentExpenses: any[] = [];
  totalExpenses = 0;
  thisMonthExpenses = 0;
  totalRecords = 0;
  categoryCount = 0;
  isLoading = true;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private expenseService: ExpenseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    this.errorMessage = '';

    this.expenseService.getExpenses().subscribe({
      next: (res: any) => {
        this.expenses = Array.isArray(res.expenses) ? res.expenses : [];
        this.updateSummaryCards();
        this.updateRecentExpenses();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load dashboard data';
        this.isLoading = false;
      }
    });
  }

  updateSummaryCards() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    this.totalExpenses = this.expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
    this.thisMonthExpenses = this.expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
      })
      .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

    this.totalRecords = this.expenses.length;
    this.categoryCount = new Set(
      this.expenses
        .map((expense) => expense.category)
        .filter((category) => !!category)
    ).size;
  }

  updateRecentExpenses() {
    this.recentExpenses = [...this.expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }

  getUserName(): string {
    return 'Test User';
  }

  logout() {
    this.authService.logout();
  }

}
