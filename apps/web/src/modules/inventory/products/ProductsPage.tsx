import React, { useState } from 'react';
import { useInventory } from '../inventoryContext';
import { Product } from '../../../types/inventory';
import { ProductFormModal } from './ProductFormModal';
import { ProductDetailModal } from './ProductDetailModal';

export const ProductsPage: React.FC = () => {
  const { products, deleteProduct } = useInventory();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ padding: '1.5rem', background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Product Catalog
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
            Manage inventory SKUs, cost vs selling prices, unit measures, and reorder thresholds.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedProduct(null);
            setIsFormOpen(true);
          }}
          style={{
            padding: '0.625rem 1.25rem',
            background: '#3B82F6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
        >
          + Create Product
        </button>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          background: 'white',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <input
          type="text"
          placeholder="Search by product name, SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: '1',
            minWidth: '220px',
            padding: '0.5rem 0.875rem',
            borderRadius: '6px',
            border: '1px solid #CBD5E1',
            fontSize: '0.875rem',
          }}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            padding: '0.5rem 0.875rem',
            borderRadius: '6px',
            border: '1px solid #CBD5E1',
            fontSize: '0.875rem',
            background: 'white',
          }}
        >
          <option value="all">All Categories</option>
          <option value="Hardware">Hardware</option>
          <option value="Peripherals">Peripherals</option>
          <option value="Networking">Networking</option>
          <option value="Electronics">Electronics</option>
          <option value="Software">Software</option>
        </select>
      </div>

      {/* Product Table */}
      <div
        style={{
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          overflowX: 'auto',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #E2E8F0', color: '#475569' }}>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>SKU</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Product Name</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Category</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Selling Price</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Cost Price</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Available Stock</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Reorder Level</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((prod) => {
                const isLowStock = prod.stock <= prod.reorderLevel;
                return (
                  <tr key={prod.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#3B82F6' }}>
                      {prod.sku}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div
                        onClick={() => {
                          setSelectedProduct(prod);
                          setIsDetailOpen(true);
                        }}
                        style={{ fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}
                      >
                        📦 {prod.name}
                      </div>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: '#475569' }}>{prod.category}</td>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#059669' }}>
                      ₹{prod.sellingPrice.toLocaleString()}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: '#64748B' }}>
                      ₹{prod.costPrice.toLocaleString()}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span
                        style={{
                          padding: '0.25rem 0.625rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: isLowStock ? '#FEE2E2' : '#D1FAE5',
                          color: isLowStock ? '#991B1B' : '#065F46',
                        }}
                      >
                        {prod.stock} {prod.unit} {isLowStock ? '⚠️ Low' : ''}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: '#64748B' }}>
                      {prod.reorderLevel} {prod.unit}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button
                          onClick={() => {
                            setSelectedProduct(prod);
                            setIsFormOpen(true);
                          }}
                          style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #CBD5E1',
                            background: 'white',
                            color: '#475569',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(prod.id)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            border: 'none',
                            background: '#FEE2E2',
                            color: '#991B1B',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {isFormOpen && (
        <ProductFormModal
          product={selectedProduct}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}

      {isDetailOpen && selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedProduct(null);
          }}
          onEdit={() => setIsFormOpen(true)}
        />
      )}
    </div>
  );
};
