import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Public pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import BuyPage from './pages/user/BuyPage';
import SellPage from './pages/user/SellPage';
import CardDetailPage from './pages/user/CardDetailPage';
import CartPage from './pages/user/CartPage';

// Admin pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import PricingManager from './pages/admin/PricingManager';

// Protected route component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Define routes
const routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/buy',
    element: <BuyPage />,
  },
  {
    path: '/sell',
    element: <SellPage />,
  },
  {
    path: '/cards/:id',
    element: <CardDetailPage />,
  },
  {
    path: '/cart',
    element: <CartPage />,
  },
  {
    path: '/admin/login',
    element: <Login />,
  },
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute requireAdmin>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/pricing',
    element: (
      <ProtectedRoute requireAdmin>
        <PricingManager />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
