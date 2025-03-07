import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import Button from '../common/Button';

const Cart = () => {
  const {
    cartItems,
    cartType,
    removeFromCart,
    updateQuantity,
    clearCart,
    switchCartType,
    getTotalPrice
  } = useCart();
  
  // Handle empty cart
  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12 border border-gray-200 rounded-lg bg-white">
        <div className="text-gray-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-6">Start adding items to your {cartType} cart!</p>
        <div className="flex justify-center gap-4">
          <Link to="/buy">
            <Button variant={cartType === 'buy' ? 'primary' : 'outline'} onClick={() => switchCartType('buy')}>
              Shop Buy Prices
            </Button>
          </Link>
          <Link to="/sell">
            <Button variant={cartType === 'sell' ? 'primary' : 'outline'} onClick={() => switchCartType('sell')}>
              Shop Sell Prices
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  // Handle quantity change
  const handleQuantityChange = (id, condition, quantity) => {
    updateQuantity(id, condition, quantity);
  };
  
  // Handle remove item
  const handleRemoveItem = (id, condition) => {
    removeFromCart(id, condition);
  };
  
  // Handle clear cart
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };
  
  // Handle switch cart type
  const handleSwitchCartType = (type) => {
    if (cartItems.length > 0) {
      if (window.confirm(`Switching will clear your current ${cartType} cart. Continue?`)) {
        switchCartType(type);
      }
    } else {
      switchCartType(type);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Cart header */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">
          Your {cartType.charAt(0).toUpperCase() + cartType.slice(1)} Cart
        </h2>
        <div className="flex gap-2">
          <Button
            variant={cartType === 'buy' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleSwitchCartType('buy')}
          >
            Buy
          </Button>
          <Button
            variant={cartType === 'sell' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleSwitchCartType('sell')}
          >
            Sell
          </Button>
        </div>
      </div>
      
      {/* Cart items */}
      <div className="px-6 py-4">
        <div className="mb-6">
          <ul className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <li key={`${item.id}-${item.condition}`} className="py-4">
                <div className="flex items-center">
                  {/* Item image */}
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={item.image || 'https://via.placeholder.com/400x560?text=No+Image'}
                      alt={item.name}
                      className="h-full w-full object-contain object-center"
                    />
                  </div>
                  
                  {/* Item details */}
                  <div className="ml-4 flex-1 flex flex-col">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-base font-medium text-gray-900">
                          <Link to={`/cards/${item.id}`} className="hover:text-primary-600">
                            {item.name}
                          </Link>
                        </h3>
                        <p className="ml-4 text-base font-medium text-gray-900">
                          ${cartType === 'buy' ? item.buyPrice.toFixed(2) : item.salePrice.toFixed(2)}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Condition: {item.condition}</p>
                    </div>
                    
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className="flex items-center">
                        <label htmlFor={`quantity-${item.id}-${item.condition}`} className="mr-2 text-gray-500">
                          Qty
                        </label>
                        <input
                          id={`quantity-${item.id}-${item.condition}`}
                          type="number"
                          min="1"
                          value={item.quantity || 1}
                          onChange={(e) => handleQuantityChange(item.id, item.condition, parseInt(e.target.value, 10))}
                          className="w-16 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>
                      
                      <div className="flex">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id, item.condition)}
                          className="font-medium text-red-600 hover:text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Cart summary */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
            <p>Subtotal</p>
            <p>${getTotalPrice().toFixed(2)}</p>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleClearCart}>
              Clear Cart
            </Button>
            
            <Button>
              {cartType === 'buy' ? 'Checkout' : 'Submit for Sale'}
            </Button>
          </div>
          
          <div className="mt-6">
            <p className="text-sm text-gray-500 text-center">
              This cart is for reference only and does not process actual transactions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
