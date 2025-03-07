import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import Button from '../common/Button';
import { LoadingContainer } from '../common/Spinner';

const CardDetail = ({ card, isLoading, error }) => {
  const { addToCart } = useCart();
  const [selectedCondition, setSelectedCondition] = useState(null);
  
  // Handle loading state
  if (isLoading) {
    return <LoadingContainer message="Loading card details..." />;
  }
  
  // Handle error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Card</h3>
        <p className="text-gray-600">{error.message || 'An error occurred while loading the card details. Please try again.'}</p>
        <Link to="/" className="mt-4 inline-block">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    );
  }
  
  // Handle missing card data
  if (!card) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Card Not Found</h3>
        <p className="text-gray-600">The card you're looking for does not exist or has been removed.</p>
        <Link to="/" className="mt-4 inline-block">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    );
  }
  
  // Get featured conditions
  const featuredConditions = ['Ungraded', 'PSA 10', 'BGS 10 BL', 'CGC 10 PR'];
  
  // Filter and sort prices
  const sortedPrices = [...(card.prices || [])].sort((a, b) => {
    // First sort by featured status
    const aFeatured = featuredConditions.includes(a.condition);
    const bFeatured = featuredConditions.includes(b.condition);
    
    if (aFeatured && !bFeatured) return -1;
    if (!aFeatured && bFeatured) return 1;
    
    // Then sort by PSA grade (descending)
    if (a.condition.startsWith('PSA') && b.condition.startsWith('PSA')) {
      const aGrade = parseInt(a.condition.replace('PSA ', ''));
      const bGrade = parseInt(b.condition.replace('PSA ', ''));
      return bGrade - aGrade;
    }
    
    // Then sort alphabetically
    return a.condition.localeCompare(b.condition);
  });
  
  // Handle adding to cart
  const handleAddToCart = (price, type) => {
    const cartItem = {
      id: card.id,
      name: card.name,
      condition: price.condition,
      image: card.image_url,
      buyPrice: price.buy_price,
      salePrice: price.sale_price,
      quantity: 1,
    };
    
    addToCart(cartItem, type);
    setSelectedCondition(price.condition);
    
    // Reset selected condition after a delay
    setTimeout(() => {
      setSelectedCondition(null);
    }, 2000);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="md:flex">
        {/* Card image */}
        <div className="md:w-1/3 p-4 flex items-center justify-center">
          <img
            src={card.image_url || 'https://via.placeholder.com/400x560?text=No+Image'}
            alt={card.name}
            className="max-w-full h-auto rounded"
          />
        </div>
        
        {/* Card details */}
        <div className="md:w-2/3 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{card.name}</h1>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {card.set_name && (
                <span className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                  Set: {card.set_name}
                </span>
              )}
              
              {card.set_code && (
                <span className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                  Code: {card.set_code}
                </span>
              )}
              
              {card.category && (
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {card.category}
                </span>
              )}
            </div>
            
            {card.description && (
              <div className="text-gray-700 mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p>{card.description}</p>
              </div>
            )}
          </div>
          
          {/* Prices section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Available Prices</h3>
            
            {sortedPrices && sortedPrices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedPrices.map((price) => (
                  <div
                    key={price.id}
                    className={`border rounded-lg p-4 ${
                      selectedCondition === price.condition
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-gray-900">{price.condition}</h4>
                      
                      {price.quantity > 0 ? (
                        <span className="badge badge-success">In Stock</span>
                      ) : (
                        <span className="badge badge-error">Out of Stock</span>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2 mb-4">
                      {price.show_buy_price && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Buy Price:</span>
                          <span className="font-semibold text-green-600">${price.buy_price.toFixed(2)}</span>
                        </div>
                      )}
                      
                      {price.show_sell_price && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Sell Price:</span>
                          <span className="font-semibold text-blue-600">${price.sale_price.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {price.show_buy_price && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleAddToCart(price, 'buy')}
                          disabled={price.quantity <= 0}
                        >
                          {selectedCondition === price.condition ? 'Added!' : 'Add to Buy'}
                        </Button>
                      )}
                      
                      {price.show_sell_price && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleAddToCart(price, 'sell')}
                        >
                          {selectedCondition === price.condition ? 'Added!' : 'Add to Sell'}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No price data available for this card.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetail;
