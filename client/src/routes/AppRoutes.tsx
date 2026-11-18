import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { DynamicPortfolioPage } from '../pages/DynamicPortfolioPage';
import { AdminLoginPage } from '../pages/admin/AdminLoginPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { PortfolioBuilderPage } from '../pages/admin/PortfolioBuilderPage';
import { ProtectedRoute } from '../components/common/ProtectedRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. Public Main Platform Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* 2. Admin Authentication */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* 3. Protected Admin Management Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/portfolios/new"
        element={
          <ProtectedRoute>
            <PortfolioBuilderPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/portfolios/:id/edit"
        element={
          <ProtectedRoute>
            <PortfolioBuilderPage />
          </ProtectedRoute>
        }
      />

      {/* 4. Dynamic Portfolio Route (slug-driven: /dj, /manoj, etc.) */}
      <Route path="/:slug" element={<DynamicPortfolioPage />} />

      {/* 5. Fallback 404 */}
      <Route path="*" element={<DynamicPortfolioPage />} />
    </Routes>
  );
};
