import React, { useState } from 'react';
import { useCards } from '../../hooks/useCards';
import Card from '../../components/common/Card';
import Spinner, { LoadingContainer } from '../../components/common/Spinner';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const SellPage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [currentSearch, setCurrentSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  
  // Get card data with pagination, search, and sorting
  const { data, isLoading, isError } = useCards({
    page,
    search: currentSearch,
    sortBy,
    sortOrder,
    category: category || null,
  });
  
  // Handle search form submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentSearch(searchValue);
    setPage(1);
  };
  
  // Handle category filter change
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };
  
  // Handle sort change
  const handleSortChange = (e) => {
    const [newSortBy, newSortOrder] = e.target.value.split('-');
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setPage(1);
  };
  
  // Handle page change
  const goToPage = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cards We're Selling</h1>
        <p className="text-gray-600">
          Browse our current sell prices for trading cards. Add cards to your cart for easier reference.
        </p>
      </header>
      
      {/* Search and filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search form */}
          <form className="col-span-2" onSubmit={handleSearchSubmit}>
            <div className="flex">
              <Input
                type="text"
                placeholder="Search cards..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="mb-0 flex-1"
                leftIcon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
              <Button type="submit" className="ml-2">
                Search
              </Button>
            </div>
          </form>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={category}
              onChange={handleCategoryChange}
              className="rounded-md border-gray-300 py-2 focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">All Categories</option>
              <option value="Pokemon">Pokémon</option>
              <option value="Magic: The Gathering">Magic: The Gathering</option>
              <option value="Yu-Gi-Oh!">Yu-Gi-Oh!</option>
              <option value="Sports">Sports</option>
              <option value="Other">Other</option>
            </select>
            
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={handleSortChange}
              className="rounded-md border-gray-300 py-2 focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="set_name-asc">Set (A-Z)</option>
              <option value="set_name-desc">Set (Z-A)</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Results */}
      {isLoading ? (
        <LoadingContainer message="Loading cards..." />
      ) : isError ? (
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">Failed to load cards. Please try again.</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      ) : (
        <>
?.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">No cards found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filters to see more results.</p>
              {currentSearch && (
                <Button variant="outline" onClick={() => {
                  setSearchValue('');
                  setCurrentSearch('');
                }}>
                  Clear Search
                </Button>
              )}, ', ', etc.</p>
            </div>
          ) : (
            <>
              {/* Card count and current filters */}
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-600">
                  Showing {data?.cards?.length} of {data?.pagination?.total} cards
                </p>
                
                {(currentSearch || category) && (
                  <div className="flex gap-2">
                    {currentSearch && (
                      <div className="inline-flex items-center bg-primary-50 text-primary-800 px-3 py-1 rounded-full text-sm">
                        Search: {currentSearch}
                        <button
                          onClick={() => {
                            setSearchValue('');
                            setCurrentSearch('');
                          }}
                          className="ml-2 text-primary-600 hover:text-primary-800"
                        >
                          &times;
                        </button>
                      </div>
                    )}
                    
                    {category && (
                      <div className="inline-flex items-center bg-secondary-50 text-secondary-800 px-3 py-1 rounded-full text-sm">
                        Category: {category}
                        <button
                          onClick={() => setCategory('')}
                          className="ml-2 text-secondary-600 hover:text-secondary-800"
                        >
                          &times;
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Card grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {data?.cards?.map((card) => (
                  <Card
                    key={card.id}
                    card={card}
                    showBuyPrice={false}
                    showSellPrice={true}
                    featuredConditionsOnly={true}
                  />
                ))}
              </div>
              
              {/* Pagination */}
              {data?.pagination?.pages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      onClick={() => goToPage(page - 1)}
                      disabled={page === 1}
                      size="sm"
                    >
                      &lt; Previous
                    </Button>
                    
                    {[...Array(data.pagination.pages)].map((_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <Button
                          key={pageNumber}
                          variant={pageNumber === page ? 'primary' : 'outline'}
                          onClick={() => goToPage(pageNumber)}
                          size="sm"
                          className="min-w-[40px]"
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                    
                    <Button
                      variant="outline"
                      onClick={() => goToPage(page + 1)}
                      disabled={page === data.pagination.pages}
                      size="sm"
                    >
                      Next &gt;
                    </Button>
                  </nav>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SellPage;
