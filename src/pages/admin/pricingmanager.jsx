import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { useCards, useBulkUpdatePrices, useTogglePriceVisibility } from '../../hooks/useCards';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { LoadingContainer } from '../../components/common/Spinner';

const PricingManager = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // States for search and filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [selectedCards, setSelectedCards] = useState([]);
  const [selectedCondition, setSelectedCondition] = useState('');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isVisibilityModalOpen, setIsVisibilityModalOpen] = useState(false);
  
  // Fetch cards data
  const { data, isLoading, isError, refetch } = useCards({
    page,
    search: activeSearch,
    category: category || null,
    limit: 20,
  });
  
  // Mutations for updates
  const bulkUpdatePrices = useBulkUpdatePrices();
  const toggleVisibility = useTogglePriceVisibility();
  
  // Check authentication and admin status
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin/login');
    } else if (!isAdmin()) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);
  
  // Handle search form submit
  const handleSearch = (e) => {
    e.preventDefault();
    setActiveSearch(searchQuery);
    setPage(1);
  };
  
  // Handle card selection
  const handleCardSelection = (cardId) => {
    if (selectedCards.includes(cardId)) {
      setSelectedCards(selectedCards.filter(id => id !== cardId));
    } else {
      setSelectedCards([...selectedCards, cardId]);
    }
  };
  
  // Handle select all cards
  const handleSelectAll = () => {
    if (data?.cards && data.cards.length > 0) {
      if (selectedCards.length === data.cards.length) {
        // If all cards are already selected, deselect all
        setSelectedCards([]);
      } else {
        // Otherwise, select all cards
        setSelectedCards(data.cards.map(card => card.id));
      }
    }
  };
  
  // Open update modal
  const openUpdateModal = (condition) => {
    setSelectedCondition(condition);
    setIsUpdateModalOpen(true);
  };
  
  // Open visibility modal
  const openVisibilityModal = (condition) => {
    setSelectedCondition(condition);
    setIsVisibilityModalOpen(true);
  };
  
  // Bulk price update form
  const updateFormik = useFormik({
    initialValues: {
      costPrice: '',
      marketPrice: '',
    },
    validationSchema: Yup.object({
      costPrice: Yup.number()
        .min(0, 'Cost price must be at least 0')
        .nullable(),
      marketPrice: Yup.number()
        .min(0, 'Market price must be at least 0')
        .nullable(),
    }),
    onSubmit: async (values) => {
      if (!selectedCondition || selectedCards.length === 0) return;
      
      try {
        // Prepare the prices data for bulk update
        const priceUpdates = [];
        
        // Get all cards with their prices
        for (const cardId of selectedCards) {
          const card = data.cards.find(c => c.id === cardId);
          if (!card || !card.prices) continue;
          
          // Find the price record for the selected condition
          const priceRecord = card.prices.find(p => p.condition === selectedCondition);
          if (!priceRecord) continue;
          
          // Add the price update
          priceUpdates.push({
            id: priceRecord.id,
            ...(values.costPrice !== '' && { cost_price: parseFloat(values.costPrice) }),
            ...(values.marketPrice !== '' && { market_price: parseFloat(values.marketPrice) }),
          });
        }
        
        // Perform the bulk update
        if (priceUpdates.length > 0) {
          await bulkUpdatePrices.mutateAsync(priceUpdates);
          
          // Close modal and refetch data
          setIsUpdateModalOpen(false);
          refetch();
        }
      } catch (error) {
        console.error('Failed to update prices:', error);
      }
    },
  });
  
  // Visibility toggle form
  const visibilityFormik = useFormik({
    initialValues: {
      showBuyPrice: false,
      showSellPrice: false,
    },
    onSubmit: async (values) => {
      if (!selectedCondition || selectedCards.length === 0) return;
      
      try {
        // Prepare the price IDs for visibility toggle
        const priceIds = [];
        
        // Get all cards with their prices
        for (const cardId of selectedCards) {
          const card = data.cards.find(c => c.id === cardId);
          if (!card || !card.prices) continue;
          
          // Find the price record for the selected condition
          const priceRecord = card.prices.find(p => p.condition === selectedCondition);
          if (!priceRecord) continue;
          
          // Add the price ID
          priceIds.push(priceRecord.id);
        }
        
        // Perform the visibility toggle
        if (priceIds.length > 0) {
          await toggleVisibility.mutateAsync({
            priceIds,
            showBuyPrice: values.showBuyPrice,
            showSellPrice: values.showSellPrice,
          });
          
          // Close modal and refetch data
          setIsVisibilityModalOpen(false);
          refetch();
        }
      } catch (error) {
        console.error('Failed to toggle visibility:', error);
      }
    },
  });
  
  // If not authenticated or not admin, don't render anything
  if (!isAuthenticated() || !isAdmin()) {
    return <LoadingContainer message="Checking authorization..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Price Manager</h1>
        <p className="text-gray-600 mt-1">
          Manage and update card prices and visibility settings
        </p>
      </header>
      
      {/* Search and filter controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search cards by name or set..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-0"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-md border-gray-300 py-2 focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">All Categories</option>
              <option value="Pokemon">Pokémon</option>
              <option value="Magic: The Gathering">Magic: The Gathering</option>
              <option value="Yu-Gi-Oh!">Yu-Gi-Oh!</option>
              <option value="Sports">Sports</option>
              <option value="Other">Other</option>
            </select>
            <Button type="submit">Search</Button>
          </div>
        </form>
      </div>
      
      {/* Bulk actions */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold text-lg">Bulk Actions</h2>
            <p className="text-gray-600 text-sm">
              Select cards and choose an action to perform in bulk
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {/* Select condition dropdown */}
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="rounded-md border-gray-300 py-2 focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">Select Condition</option>
              <option value="Ungraded">Ungraded</option>
              <option value="PSA 1">PSA 1</option>
              <option value="PSA 2">PSA 2</option>
              <option value="PSA 3">PSA 3</option>
              <option value="PSA 4">PSA 4</option>
              <option value="PSA 5">PSA 5</option>
              <option value="PSA 6">PSA 6</option>
              <option value="PSA 7">PSA 7</option>
              <option value="PSA 8">PSA 8</option>
              <option value="PSA 9">PSA 9</option>
              <option value="PSA 10">PSA 10</option>
              <option value="CGC 10">CGC 10</option>
              <option value="BGS 10">BGS 10</option>
              <option value="BGS 10 BL">BGS 10 BL</option>
              <option value="CGC 10 PR">CGC 10 PR</option>
            </select>
            
            {/* Bulk action buttons */}
            <Button
              variant="outline"
              onClick={() => openUpdateModal(selectedCondition)}
              disabled={!selectedCondition || selectedCards.length === 0}
            >
              Update Prices
            </Button>
          </div>
        </div>
      </div>
      
      {/* Card list */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">Cards</h2>
            <div className="flex items-center">
              <span className="text-gray-600 text-sm mr-2">
                {selectedCards.length} of {data?.cards?.length || 0} selected
              </span>
              <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                {selectedCards.length === data?.cards?.length 
                  ? 'Deselect All' 
                  : 'Select All'
                }
              </Button>
            </div>
          </div>
        </div>
        
        {/* Card table */}
        {isLoading ? (
          <div className="p-8 text-center">
            <LoadingContainer message="Loading cards..." />
          </div>
        ) : isError ? (
          <div className="p-8 text-center">
            <p className="text-red-500 mb-4">Failed to load cards.</p>
            <Button variant="outline" onClick={refetch}>
              Try Again
            </Button>
          </div>
        ) : data?.cards && data.cards.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedCards.length === data.cards.length}
                      onChange={handleSelectAll}
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Card
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Set
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price Info
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.cards.map((card) => (
                  <tr key={card.id} className={selectedCards.includes(card.id) ? 'bg-primary-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedCards.includes(card.id)}
                        onChange={() => handleCardSelection(card.id)}
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={card.image_url || 'https://via.placeholder.com/40'} 
                            alt={card.name} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{card.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{card.set_name || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {card.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {card.prices && card.prices.length > 0 
                        ? `${card.prices.length} conditions priced` 
                        : 'No prices set'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        as="a"
                        href={`/admin/cards/${card.id}`}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">No cards found.</p>
            {activeSearch && (
              <Button variant="outline" onClick={() => {
                setSearchQuery('');
                setActiveSearch('');
              }}>
                Clear Search
              </Button>
            )}
          </div>
        )}
        
        {/* Pagination */}
        {data?.pagination && data.pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Showing page {page} of {data.pagination.pages}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === data.pagination.pages}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Price Update Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title={`Update Prices - ${selectedCondition}`}
        footer={
          <Modal.Footer
            onCancel={() => setIsUpdateModalOpen(false)}
            onConfirm={updateFormik.handleSubmit}
            isLoading={bulkUpdatePrices.isLoading}
            confirmText="Update Prices"
          />
        }
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            You are updating prices for {selectedCards.length} cards with condition: {selectedCondition}.
            Leave a field blank to keep the current value.
          </p>
          
          <Input
            id="costPrice"
            name="costPrice"
            type="number"
            label="Cost Price"
            value={updateFormik.values.costPrice}
            onChange={updateFormik.handleChange}
            onBlur={updateFormik.handleBlur}
            error={updateFormik.touched.costPrice && updateFormik.errors.costPrice}
            touched={updateFormik.touched.costPrice}
            step="0.01"
            min="0"
            placeholder="Enter cost price..."
          />
          
          <Input
            id="marketPrice"
            name="marketPrice"
            type="number"
            label="Market Price"
            value={updateFormik.values.marketPrice}
            onChange={updateFormik.handleChange}
            onBlur={updateFormik.handleBlur}
            error={updateFormik.touched.marketPrice && updateFormik.errors.marketPrice}
            touched={updateFormik.touched.marketPrice}
            step="0.01"
            min="0"
            placeholder="Enter market price..."
          />
          
          <div className="mt-2 bg-yellow-50 p-3 rounded-md">
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">Note:</span> Sale and Buy prices will be automatically calculated based on your cost and market prices.
            </p>
          </div>
        </div>
      </Modal>
      
      {/* Visibility Toggle Modal */}
      <Modal
        isOpen={isVisibilityModalOpen}
        onClose={() => setIsVisibilityModalOpen(false)}
        title={`Toggle Visibility - ${selectedCondition}`}
        footer={
          <Modal.Footer
            onCancel={() => setIsVisibilityModalOpen(false)}
            onConfirm={visibilityFormik.handleSubmit}
            isLoading={toggleVisibility.isLoading}
            confirmText="Update Visibility"
          />
        }
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            You are updating visibility settings for {selectedCards.length} cards with condition: {selectedCondition}.
          </p>
          
          <div className="flex items-center space-x-3">
            <input
              id="showBuyPrice"
              name="showBuyPrice"
              type="checkbox"
              checked={visibilityFormik.values.showBuyPrice}
              onChange={visibilityFormik.handleChange}
              className="focus:ring-primary-500 h-5 w-5 text-primary-600 border-gray-300 rounded"
            />
            <label htmlFor="showBuyPrice" className="font-medium text-gray-700">
              Show Buy Price
            </label>
          </div>
          
          <div className="flex items-center space-x-3">
            <input
              id="showSellPrice"
              name="showSellPrice"
              type="checkbox"
              checked={visibilityFormik.values.showSellPrice}
              onChange={visibilityFormik.handleChange}
              className="focus:ring-primary-500 h-5 w-5 text-primary-600 border-gray-300 rounded"
            />
            <label htmlFor="showSellPrice" className="font-medium text-gray-700">
              Show Sell Price
            </label>
          </div>
          
          <div className="mt-2 bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Note:</span> These visibility settings control whether prices are displayed to users on the buy and sell pages.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
            
            <Button
              variant="outline"
              onClick={() => openVisibilityModal(selectedCondition)}
              disabled={!selectedCondition || selectedCards.length === 0}
            >
              Toggle Visibility
            </Button>
