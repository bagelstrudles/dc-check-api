import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCards } from '../../hooks/useCards';
import Button from '../../components/common/Button';
import { LoadingContainer } from '../../components/common/Spinner';

// Card stats component
const StatsCard = ({ title, value, icon, bgColor }) => (
  <div className={`rounded-lg shadow p-5 ${bgColor}`}>
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <div className="mt-1 font-semibold text-2xl">{value}</div>
      </div>
      <div className="bg-white bg-opacity-30 p-3 rounded-full">
        {icon}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const navigate = useNavigate();
  
  // Use hooks to get card data
  const { data: cardData, isLoading: isLoadingCards } = useCards({
    limit: 5,
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  // Check authentication and admin status
  useEffect(() => {
    if (!isAuthenticated()) {
      // Redirect to login if not authenticated
      navigate('/admin/login');
    } else if (!isAdmin()) {
      // Redirect to home if authenticated but not admin
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // If not authenticated or not admin, don't render anything
  if (!isAuthenticated() || !isAdmin()) {
    return <LoadingContainer message="Checking authorization..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {user?.username || 'Admin'}
        </p>
      </header>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Total Cards" 
          value={cardData?.pagination?.total || '0'} 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
          bgColor="bg-blue-50"
        />
        
        <StatsCard 
          title="Cards with Buy Price" 
          value="--" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          bgColor="bg-green-50"
        />
        
        <StatsCard 
          title="Cards with Sell Price" 
          value="--" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          bgColor="bg-purple-50"
        />
        
        <StatsCard 
          title="Cards Without Prices" 
          value="--" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
          bgColor="bg-yellow-50"
        />
      </div>
      
      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Card Management */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-full bg-blue-100 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Card Management</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Add, edit, or remove cards from the database. Manage card information and images.
          </p>
          <Link to="/admin/cards">
            <Button variant="outline" fullWidth>
              Manage Cards
            </Button>
          </Link>
        </div>
        
        {/* Price Management */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-full bg-green-100 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Price Management</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Update cost and market prices, and manage the visibility of buy and sell prices.
          </p>
          <Link to="/admin/pricing">
            <Button variant="outline" fullWidth>
              Manage Prices
            </Button>
          </Link>
        </div>
        
        {/* Bulk Operations */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-full bg-purple-100 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Bulk Operations</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Perform bulk updates to card prices, visibility settings, and other attributes.
          </p>
          <Link to="/admin/bulk">
            <Button variant="outline" fullWidth>
              Bulk Operations
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Recent Cards */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Recently Added Cards</h3>
        </div>
        <div className="px-6 py-4">
          {isLoadingCards ? (
            <p className="text-gray-500 text-center py-4">Loading recent cards...</p>
          ) : cardData?.cards && cardData.cards.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {cardData.cards.map((card) => (
                <div key={card.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    {card.image_url ? (
                      <img 
                        src={card.image_url} 
                        alt={card.name} 
                        className="w-10 h-10 object-cover rounded mr-3"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded mr-3 flex items-center justify-center text-gray-500">
                        No img
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900">{card.name}</h4>
                      <p className="text-sm text-gray-500">{card.set_name || 'No set'}</p>
                    </div>
                  </div>
                  <Link to={`/admin/cards/${card.id}`}>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No cards found</p>
          )}
          
          <div className="mt-4 text-center">
            <Link to="/admin/cards">
              <Button variant="outline" size="sm">
                View All Cards
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
