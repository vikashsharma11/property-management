import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import PropertyList from './pages/PropertyList';
import PropertyDetails from './pages/PropertyDetails';
import BookingForm from './pages/BookingForm';
import AdminDashboard from './pages/AdminDashboard';
import AdminAuth from './components/AdminAuth';
import CustomerAuth from './components/CustomerAuth';
import ProtectedRoute from './components/ProtectedRoute';
import PaymentPage from './pages/PaymentForm';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<ProtectedRoute><PropertyList /></ProtectedRoute>} />
            <Route path="/property/:id" element={<ProtectedRoute><PropertyDetails /></ProtectedRoute>} />
            <Route path="/auth/admin" element={<AdminAuth />} />
            <Route path="/auth" element={<CustomerAuth />} />
            
            {/* Protected Routes */}
            <Route 
              path="/booking/:id" 
              element={<BookingForm />} />
            <Route 
              path="/payment/:id" 
              element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
            
            <Route 
              path="/admin" 
              element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
