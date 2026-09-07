import React, { useState } from 'react';

export const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search for:', query);
  };

  return (
    <div className="search-container">
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="search-input"
          placeholder="Search... (Ctrl+K)"
          value={query}
          onChange={handleSearch}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
        <button type="submit" className="search-btn">
          🔍
        </button>
      </form>

      {isOpen && query && (
        <div className="search-results">
          <div className="search-result-item">
            <span>{query}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
