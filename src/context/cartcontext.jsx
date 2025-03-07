import { createContext, useState, useEffect } from 'react';

// Create cart context
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage or empty array
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  // Track if cart is being viewed for buy or sell
  const [cartType, setCartType] = useState(() => {
    const savedCartType = localStorage.getItem('cartType');
    return savedCartType || 'buy'; // Default to 'buy'
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Save cart type to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartType', cartType);
  }, [cartType]);

  // Add item to cart
  const addToCart = (item, type = 'buy') => {
    // Check if the item with the same condition is already in cart
    const existingItemIndex = cartItems.findIndex(
      cartItem => cartItem.id === item.id && cartItem.condition === item.condition
    );

    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: (updatedCart[existingItemIndex].quantity || 1) + (item.quantity || 1)
      };
      setCartItems(updatedCart);
    } else {
      // Add new item with type ('buy' or 'sell')
      setCartItems([...cartItems, { ...item, type }]);
    }

    // Set cart type if adding first item
    if (cartItems.length === 0) {
      setCartType(type);
    }
  };

  // Remove item from cart
  const removeFromCart = (itemId, condition) => {
    setCartItems(
      cartItems.filter(
        item => !(item.id === itemId && item.condition === condition)
      )
    );
  };

  // Update item quantity
  const updateQuantity = (itemId, condition, quantity) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === itemId && item.condition === condition) {
        return { ...item, quantity: Math.max(1, quantity) };
      }
      return item;
    });
    setCartItems(updatedCart);
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Switch cart type
  const switchCartType = (type) => {
    setCartType(type);
    // Clear the cart when switching types
    setCartItems([]);
  };

  // Get total items count
  const getItemsCount = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  // Get total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = cartType === 'buy' ? item.buyPrice : item.salePrice;
      return total + (price * (item.quantity || 1));
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartType,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        switchCartType,
        getItemsCount,
        getTotalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
