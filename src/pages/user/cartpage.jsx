import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const CartPage = () => {
  const { 
    cartItems, 
    cartType, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    switchCartType, 
    getItemsCount, 
    getTotalPrice 
  } = useCart();
  
  const [isConfirmClearModalOpen, setIsConfirmClearModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCartSwitchModalOpen, setIsCartSwitchModalOpen] = useState(false);
  
  // Handle quantity change
  const handleQuantityChange = (id, condition, newQuantity) => {
    if (newQuantity < 1) newQuantity = 1;
    updateQuantity(id, condition, newQuantity);
  };
  
  // Get price for an item based on cart type
  const getItemPrice = (item) => {
    return cartType === 'buy' ? item.buyPrice : item.salePrice;
  };
  
  // Calculate item total
  const getItemTotal = (item) => {
    return getItemPrice(item) * item.quantity;
  };
  
  // Handle cart type switch
  const handleCartTypeSwitch = (newType) => {
    switchCartType(newType);
    setIsCartSwitchModalOpen(false);
  };
  
  // Generate a shareable list
  const getShareableText = () => {
    const title = `DC Check ${cartType === 'buy' ? 'Buy' : 'Sell'} List`;
    const dateTime = new Date().toLocaleString();
    
    let text = `${title}\n${dateTime}\n\n`;
    
    cartItems.forEach((item) => {
      text += `${item.name} - ${item.condition}\n`;
      text += `${cartType === 'buy' ? 'Buy' : 'Sell'} Price: $${getItemPrice(item).toFixed(2)}\n`;
      text += `Quantity: ${item.quantity}\n`;
      text += `Total: $${getItemTotal(item).toFixed(2)}\n\n`;
    });
    
    text += `Total Items: ${getItemsCount()}\n`;
    text += `Total Price: $${getTotalPrice().toFixed(2)}\n`;
    
    return text;
  };
  
  // Handle share action
  const handleShare = async () => {
    const text = getShareableText();
    
    // Try to use the Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: `DC Check ${cartType} List`,
          text: text,
        });
        return;
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
    
    // Fallback to copying to clipboard
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
    
    setIsShareModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Your {cartType === 'buy' ? 'Buy' : 'Sell'} Cart
        </h1>
        <p className="text-gray-600">
          Review your {cartType === 'buy' ? 'purchase' : 'sell'} list and make any adjustments before finalizing.
        </p>
      </header>
      
      {/* Cart type selector */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-gray-700 mr-2">Cart Type:</span>
            <span className={`font-medium ${cartType === 'buy' ? 'text-green-600' : 'text-blue-600'}`}>
              {cartType === 'buy' ? 'Buy' : 'Sell'}
            </span>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsCartSwitchModalOpen(true)}
          >
            Switch to {cartType === 'buy' ? 'Sell' : 'Buy'} Cart
          </Button>
        </div>
      </div>
      
      {/* Empty cart state */}
      {cartItems.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Add cards from our {cartType === 'buy' ? 'buy' : 'sell'} page to see them here.
          </p>
          <Link to={cartType === 'buy' ? '/buy' : '/sell'}>
            <Button>
              Browse {cartType === 'buy' ? 'Buy' : 'Sell'} Items
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          {/* Cart items list */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Card
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Condition
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <tr key={`${item.id}-${item.condition}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={item.image || 'https://via.placeholder.com/40'} 
                            alt={item.name} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            <Link to={`/cards/${item.id}`} className="hover:text-primary-600">
                              {item.name}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.condition}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${getItemPrice(item).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.condition, item.quantity - 1)}
                          className="p-1 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <span className="mx-2 w-8 text-center text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.condition, item.quantity + 1)}
                          className="p-1 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      ${getItemTotal(item).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => removeFromCart(item.id, item.condition)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Cart summary and actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div>
                <div className="text-gray-700">
                  <span className="font-medium">Total Items:</span> {getItemsCount()}
                </div>
                <div className="text-gray-900 text-lg font-bold">
                  <span className="font-medium">Total:</span> ${getTotalPrice().toFixed(2)}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsShareModalOpen(true)}
                >
                  Share List
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setIsConfirmClearModalOpen(true)}
                >
                  Clear Cart
                </Button>
                
                <Link to={cartType === 'buy' ? '/buy' : '/sell'}>
                  <Button>
                    Continue {cartType === 'buy' ? 'Shopping' : 'Listing'}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Clear Cart Confirmation Modal */}
      <Modal
        isOpen={isConfirmClearModalOpen}
        onClose={() => setIsConfirmClearModalOpen(false)}
        title="Clear Cart"
        footer={
          <Modal.Footer
            onCancel={() => setIsConfirmClearModalOpen(false)}
            onConfirm={() => {
              clearCart();
              setIsConfirmClearModalOpen(false);
            }}
            confirmText="Clear Cart"
          />
        }
      >
        <p className="text-gray-700">
          Are you sure you want to clear all items from your cart? This action cannot be undone.
        </p>
      </Modal>
      
      {/* Share Cart Modal */}
      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Share Your List"
        footer={
          <Modal.Footer
            onCancel={() => setIsShareModalOpen(false)}
            onConfirm={handleShare}
            confirmText="Copy to Clipboard"
          />
        }
      >
        <div className="max-h-96 overflow-y-auto bg-gray-50 p-4 rounded-md text-sm font-mono whitespace-pre-wrap">
          {getShareableText()}
        </div>
      </Modal>
      
      {/* Switch Cart Type Modal */}
      <Modal
        isOpen={isCartSwitchModalOpen}
        onClose={() => setIsCartSwitchModalOpen(false)}
        title="Switch Cart Type"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCartSwitchModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleCartTypeSwitch(cartType === 'buy' ? 'sell' : 'buy')}>
              Switch to {cartType === 'buy' ? 'Sell' : 'Buy'} Cart
            </Button>
          </div>
        }
      >
        <div className="text-gray-700">
          <p className="mb-4">
            You are about to switch from <span className="font-medium">{cartType === 'buy' ? 'Buy' : 'Sell'}</span> cart to <span className="font-medium">{cartType === 'buy' ? 'Sell' : 'Buy'}</span> cart.
          </p>
          <p className="mb-4">
            This will clear all current items from your cart. Are you sure you want to proceed?
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default CartPage;
