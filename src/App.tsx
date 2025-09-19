import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store';
import { useAuth } from './hooks/useAuth';
import { useAppDispatch } from './store';
import { fetchProfile } from './store/slices/authSlice';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import Home from './features/user/pages/Home';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Dashboard from './features/admin/pages/Dashboard';

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Layout component
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {isAuthenticated ? (
        <div className="flex">
          <Sidebar />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      ) : (
        <main>{children}</main>
      )}
    </div>
  );
};

// Main App component
const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, token } = useAuth();

  // Initialize user profile if authenticated
  useEffect(() => {
    if (isAuthenticated && token && !store.getState().auth.user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, isAuthenticated, token]);

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected user routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/route-planner" 
            element={
              <ProtectedRoute>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Route Planner</h1>
                  <p className="text-gray-600 mt-2">Coming soon...</p>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notifications" 
            element={
              <ProtectedRoute>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Notifications</h1>
                  <p className="text-gray-600 mt-2">Coming soon...</p>
                </div>
              </ProtectedRoute>
            } 
          />
          
          {/* Protected admin routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/buses" 
            element={
              <ProtectedRoute adminOnly>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Bus Management</h1>
                  <p className="text-gray-600 mt-2">Coming soon...</p>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/routes" 
            element={
              <ProtectedRoute adminOnly>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Route Management</h1>
                  <p className="text-gray-600 mt-2">Coming soon...</p>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/reports" 
            element={
              <ProtectedRoute adminOnly>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Reports</h1>
                  <p className="text-gray-600 mt-2">Coming soon...</p>
                </div>
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;