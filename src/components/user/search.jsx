import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';

const Search = ({ onSearch, initialValue = '', placeholder = 'Search for cards...' }) => {
  const [query, setQuery] = useState(initialValue);
  const [category, setCategory] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Update query when initialValue changes
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);
  
  // Parse URL search params on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('q') || '';
    const categoryParam = searchParams.get('category') || '';
    
    setQuery(searchQuery);
    setCategory(categoryParam);
  }, [location.search]);
  
  // Handle search form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Build search params
    const searchParams = new URLSearchParams();
    if (query.trim()) {
      searchParams.set('q', query.trim());
    }
    if (category) {
      searchParams.set('category', category);
    }
    
    // Update URL with search params
    const searchString = searchParams.toString();
    const currentPath = location.pathname;
    navigate(`${currentPath}${searchString ? `?${searchString}` : ''}`);
    
    // Call the onSearch callback if provided
    if (onSearch) {
      onSearch({ query: query.trim(), category });
    }
  };
  
  // Handle input change
  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };
  
  // Handle category change
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };
  
  // Clear search
  const handleClear = () => {
    setQuery('');
    setCategory('');
    
    // Update URL
    navigate(location.pathname);
    
    // Call the onSearch callback if provided
    if (onSearch) {
      onSearch({ query: '', category: '' });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <Input
            type="text"
            name="search"
            value={query}
            onChange={handleQueryChange}
            placeholder={placeholder}
            className="mb-0"
            leftIcon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        </div>
        
        <div className="w-full md:w-auto">
          <select
            name="category"
            value={category}
            onChange={handleCategoryChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm h-10"
          >
            <option value="">All Categories</option>
            <option value="Pokemon">Pokemon</option>
            <option value="Magic: The Gathering">Magic: The Gathering</option>
            <option value="Yu-Gi-Oh!">Yu-Gi-Oh!</option>
            <option value="Sports">Sports</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="flex gap-2">
          <Button type="submit" variant="primary">
            Search
          </Button>
          
          {(query || category) && (
            <Button type="button" variant="outline" onClick={handleClear}>
              Clear
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

export default Search;
