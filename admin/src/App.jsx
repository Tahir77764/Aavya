import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ProductCreate from './pages/ProductCreate';
import ProductEdit from './pages/ProductEdit';
import AdminLogin from './pages/AdminLogin';
import Home from './pages/Home';
import UserList from './pages/UserList';
import UserEdit from './pages/UserEdit';
import UserDetail from './pages/UserDetail';
import OrderList from './pages/OrderList';
import OrderDetail from './pages/OrderDetail';
import TrendingManagement from './pages/TrendingManagement';
import FutureManagement from './pages/FutureManagement';
import Navbar from "./Components/Navbar";
import Footer from './Components/Footer';


const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }, [pathname]);

  return null;
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const userInfo = localStorage.getItem('userInfo');
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }
  const user = JSON.parse(userInfo);
  if (!user.isAdmin) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Layout component to handle Navbar visibility
const Layout = () => {
  const location = useLocation();
  // Show navbar everywhere except login page
  const showNavbar = location.pathname !== '/login';

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-avaya-dark flex flex-col">
      <ScrollToTop />
      {showNavbar && <Navbar />}
      <div className="flex-1">
        <Routes>
          <Route path="/login" element={<AdminLogin />} />

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/product/create"
            element={
              <ProtectedRoute>
                <ProductCreate />
              </ProtectedRoute>
            }
          />

          <Route
            path="/product/edit/:id"
            element={
              <ProtectedRoute>
                <ProductEdit />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UserList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users/edit/:id"
            element={
              <ProtectedRoute>
                <UserEdit />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users/:id"
            element={
              <ProtectedRoute>
                <UserDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trending"
            element={
              <ProtectedRoute>
                <TrendingManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/future"
            element={
              <ProtectedRoute>
                <FutureManagement />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      {showNavbar && location.pathname !== '/' && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      <Layout />
    </Router>
  );
}

export default App;
