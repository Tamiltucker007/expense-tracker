import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { DashboardComponent } from './components/dashboard/dashboard';
import { ExpenseListComponent } from './components/expense-list/expense-list';
import { ExpenseFormComponent } from './components/expense-form/expense-form';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'expenses',
    component: ExpenseListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'expenses/add',
    component: ExpenseFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'expenses/edit/:id',
    component: ExpenseFormComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'login' }
];