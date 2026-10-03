import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.getElementById('global-search-input');
        input?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchResults = [
    { type: 'CRM', title: 'Infosys Implementation', link: '/crm', icon: '🏢' },
    { type: 'Sales', title: 'SO-00001 (Confirmed)', link: '/sales', icon: '📦' },
    { type: 'Inventory', title: 'Enterprise License - 100 Users', link: '/inventory', icon: '📱' },
    { type: 'Finance', title: 'INV-00001 (₹27,14,000)', link: '/finance', icon: '📄' },
  ].filter((item) =>
    query ? item.title.toLowerCase().includes(query.toLowerCase()) || item.type.toLowerCase().includes(query.toLowerCase()) : true
  );

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <span className="search-icon-prefix">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </span>
        <input
          id="global-search-input"
          type="text"
          className="search-input"
          placeholder="Search Leads, Orders, Invoices, Products..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        <kbd className="search-shortcut">Ctrl+K</kbd>
      </div>

      {isOpen && (
        <>
          <div className="dropdown-overlay" onClick={() => setIsOpen(false)} />
          <div className="search-results-popover">
            <div className="search-results-header">
              <span>{query ? `Results for "${query}"` : 'Quick Jump'}</span>
              <span className="search-results-hint">Press ESC to exit</span>
            </div>
            <div className="search-results-list">
              {searchResults.length === 0 ? (
                <div className="search-empty">No results found for "{query}"</div>
              ) : (
                searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    className="search-result-item"
                    onClick={() => {
                      setIsOpen(false);
                      setQuery('');
                      navigate(item.link);
                    }}
                  >
                    <span className="search-result-icon">{item.icon}</span>
                    <div className="search-result-info">
                      <span className="search-result-title">{item.title}</span>
                      <span className="search-result-type">{item.type}</span>
                    </div>
                    <span className="search-result-arrow">→</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Search;
