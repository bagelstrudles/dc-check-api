import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCard } from '../../hooks/useCards';
import { useCart } from '../../hooks/useCart';
import Button from '../../components/common/Button';
import { LoadingContainer } from '../../components/common/Spinner';

const CardDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: card, isLoading, isError } = useCard(id);
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState('buy'); // 'buy' or 'sell'
  
  // Handle adding to cart
  const handleAddToCart = (priceRecord, type) => {
    if (!card) return;
    
    const cartItem = {
      id: card.id,
      name: card.name,
      condition: priceRecord.condition,
      image: card.image_url,
      buyPrice: priceRecord.buy_price,
      salePrice: priceRecord.sale_price,
      quantity: 1,
    };
    
    addToCart(cartItem, type);
  };
  
  // Group prices by condition for easier rendering
  const groupedPrices = card?.prices?.reduce((groups, price) => {
    // Skip prices with no visibility for either buy or sell
    if (!price.show_buy_price && !price.show_sell_price) return groups;
    
    const condition = price.condition;
    if (!groups[condition]) {
      groups[condition] = price;
    }
    return groups;
  }, {}) || {};
  
  // Featured conditions should be shown first
  const featuredConditions = ['Ungraded', 'PSA 10', 'BGS 10 BL', 'CGC 10 PR'];
  const otherConditions = Object.keys(groupedPrices).filter(condition => !featuredConditions.includes(condition));
  const orderedConditions = [...featuredConditions.filter(c => groupedPrices[c]), ...otherConditions];
  
  // Handle back navigation
  const goBack = () => {
    navigate(-1);
  };
  
  if (isLoading) {
    return <LoadingContainer message="Loading card details..." />;
  }
  
  if (isError || !card) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Card not found</h2>
        <p className="text-gray-600 mb-6">
          The card you're looking for could not be found or may have been removed.
        </p>
        <Button variant="outline" onClick={goBack}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          leftIcon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          }
        >
          Back
        </Button>
      </div>
      
      {/* Card details */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Card image */}
          <div className="md:w-1/3 p-6 flex justify-center bg-gray-50">
            <img 
              src={card.image_url || 'https://via.placeholder.com/400x560?text=No+Image'} 
              alt={card.name}
              className="max-w-full h-auto object-contain max-h-96"
            />
          </div>
          
          {/* Card info */}
          <div className="md:w-2/3 p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{card.name}</h1>
            
            <div className="mb-4">
              {card.set_name && (
                <span className="inline-block bg-blue-50 text-blue-800 text-sm px-3 py-1 rounded-full mr-2 mb-2">
                  {card.set_name}
                </span>
              )}
              {card.category && (
                <span className="inline-block bg-purple-50 text-purple-800 text-sm px-3 py-1 rounded-full mr-2 mb-2">
                  {card.category}
                </span>
              )}
            </div>
            
            {card.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{card.description}</p>
              </div>
            )}
            
            {/* Price tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex">
                  <button
                    className={`py-2 px-4 text-sm font-medium border-b-2 ${
                      activeTab === 'buy'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('buy')}
                  >
                    Buy Prices
                  </button>
                  <button
                    className={`ml-8 py-2 px-4 text-sm font-medium border-b-2 ${
                      activeTab === 'sell'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('sell')}
                  >
                    Sell Prices
                  </button>
                </nav>
              </div>
            </div>
            
            {/* Prices table */}
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Condition
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {activeTab === 'buy' ? 'Buy Price' : 'Sell Price'}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orderedConditions.length > 0 ? (
                    orderedConditions.map(condition => {
                      const price = groupedPrices[condition];
                      
                      // Skip conditions without the selected price type
                      if ((activeTab === 'buy' && !price.show_buy_price) || 
                          (activeTab === 'sell' && !price.show_sell_price)) {
                        return null;
                      }
                      
                      const priceValue = activeTab === 'buy' ? price.buy_price : price.sale_price;
                      
                      return (
                        <tr key={condition}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {condition}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            ${priceValue.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAddToCart(price, activeTab)}
                            >
                              Add to Cart
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                        No {activeTab} prices available for this card.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailPage;
