import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import Button from './Button';

const Card = ({
  card,
  showBuyPrice = true,
  showSellPrice = true,
  displayMode = 'grid', // 'grid' or 'list'
  featuredConditionsOnly = false,
}) => {
  const { addToCart, cartType } = useCart();
  
  // Featured conditions that should always be shown
  const featuredConditions = ['Ungraded', 'PSA 10', 'BGS 10 BL', 'CGC 10 PR'];
  
  // Filter prices based on visibility settings and featured conditions
  const filteredPrices = card.prices?.filter(price => {
    // If featuring only specific conditions, filter by those
    if (featuredConditionsOnly && !featuredConditions.includes(price.condition)) {
      return false;
    }
    
    // Filter based on buy/sell price visibility
    return (
      (showBuyPrice && price.show_buy_price) ||
      (showSellPrice && price.show_sell_price)
    );
  });

  // Handler for adding to cart
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
  };

  return (
    <div className={`card animate-fade-in ${displayMode === 'list' ? 'flex' : ''}`}>
      {/* Card image */}
      <div className={`${displayMode === 'list' ? 'w-24 shrink-0' : 'relative pb-[100%] overflow-hidden'}`}>
        <img 
          src={card.image_url || 'https://via.placeholder.com/400x560?text=No+Image'} 
          alt={card.name}
          className={`
            ${displayMode === 'list' ? 'w-full h-24 object-cover' : 'absolute inset-0 w-full h-full object-contain'}
          `}
        />
      </div>
      
      {/* Card content */}
      <div className="p-4 flex-1">
        {/* Card header */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold truncate">
            <Link to={`/cards/${card.id}`} className="hover:text-primary-600">
              {card.name}
            </Link>
          </h3>
          <div className="text-sm text-gray-500">
            {card.set_name && (
              <span className="mr-2">{card.set_name}</span>
            )}
            {card.category && (
              <span className="badge badge-info">{card.category}</span>
            )}
          </div>
        </div>
        
        {/* Price list */}
        {filteredPrices && filteredPrices.length > 0 ? (
          <ul className="space-y-2 mb-3">
            {filteredPrices.map((price) => (
              <li key={price.id} className="flex flex-wrap justify-between items-center text-sm">
                <span className="font-medium">{price.condition}</span>
                
                <div className="flex gap-2 items-center">
                  {showBuyPrice && price.show_buy_price && (
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-1">Buy:</span>
                      <span className="font-semibold text-green-600">${price.buy_price.toFixed(2)}</span>
                      
                      {!featuredConditionsOnly && (
                        <Button 
                          variant="ghost" 
                          size="xs" 
                          className="ml-1"
                          onClick={() => handleAddToCart(price, 'buy')}
                          aria-label="Add to buy cart"
                        >
                          <span className="sr-only">Add to buy cart</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                        </Button>
                      )}
                    </div>
                  )}
                  
                  {showSellPrice && price.show_sell_price && (
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-1">Sell:</span>
                      <span className="font-semibold text-blue-600">${price.sale_price.toFixed(2)}</span>
                      
                      {!featuredConditionsOnly && (
                        <Button 
                          variant="ghost" 
                          size="xs" 
                          className="ml-1"
                          onClick={() => handleAddToCart(price, 'sell')}
                          aria-label="Add to sell cart"
                        >
                          <span className="sr-only">Add to sell cart</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No price data available</p>
        )}
        
        {/* Card actions */}
        {displayMode === 'grid' && (
          <Link to={`/cards/${card.id}`}>
            <Button variant="outline" size="sm" fullWidth>
              View Details
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Card;
