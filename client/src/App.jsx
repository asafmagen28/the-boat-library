import { Routes, Route } from 'react-router-dom';

import MainLayout from './layouts/MainLayout/MainLayout';
import AuthLayout from './layouts/AuthLayout/AuthLayout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import BooksPage from './pages/Books/BooksPage';
import AuthorsPage from './pages/Authors/AuthorsPage';
import MyLoansPage from './pages/MyLoans/MyLoansPage';
import BudgetPage from './pages/Budget/BudgetPage';
import ManageLoansPage from './pages/ManageLoans/ManageLoansPage';
import ManageCustomersPage from './pages/ManageCustomers/ManageCustomersPage';
import ReportsPage from './pages/Reports/ReportsPage';
import NotFoundPage from './pages/NotFound/NotFoundPage';

export default function App() {
  return (
    <Routes>
      {/* Public routes — centered card layout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected routes — require authentication */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {/* Shared (any authenticated user) */}
          <Route path="/" element={<HomePage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/authors" element={<AuthorsPage />} />

          {/* Customer only */}
          <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
            <Route path="/my-loans" element={<MyLoansPage />} />
            <Route path="/budget" element={<BudgetPage />} />
          </Route>

          {/* Employee only */}
          <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
            <Route path="/manage/loans" element={<ManageLoansPage />} />
            <Route path="/manage/customers" element={<ManageCustomersPage />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
