import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import routes from './routes';
import Navbar from './components/common/Navbar';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-gray-50">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  {routes.map((route, index) => (
                    <Route
                      key={index}
                      path={route.path}
                      element={route.element}
                    />
                  ))}
                </Routes>
              </main>
              <footer className="bg-white shadow-inner py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                      <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} DC Check. All rights reserved.
                      </p>
                    </div>
                    <div className="flex space-x-6">
                      <a href="#" className="text-gray-500 hover:text-gray-700">
                        Terms
                      </a>
                      <a href="#" className="text-gray-500 hover:text-gray-700">
                        Privacy
                      </a>
                      <a href="#" className="text-gray-500 hover:text-gray-700">
                        Contact
                      </a>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
            
            <ToastContainer 
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </Router>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
