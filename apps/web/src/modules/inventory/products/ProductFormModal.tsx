import React, { useState } from 'react';
import { Product, ProductStatus } from '../../../types/inventory';
import { useInventory } from '../inventoryContext';

interface ProductFormModalProps {
  product?: Product | null;
  onClose: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({ product, onClose }) => {
  const { addProduct, updateProduct } = useInventory();

  const [sku, setSku] = useState(product?.sku || `PRD-${Date.now().toString().slice(-4)}`);
  const [name, setName] = useState(product?.name || '');
  const [category, setCategory] = useState(product?.category || 'Hardware');
  const [unit, setUnit] = useState(product?.unit || 'Units');
  const [sellingPrice, setSellingPrice] = useState<number>(product?.sellingPrice || 10000);
  const [costPrice, setCostPrice] = useState<number>(product?.costPrice || 7000);
  const [stock, setStock] = useState<number>(product?.stock || 50);
  const [reorderLevel, setReorderLevel] = useState<number>(product?.reorderLevel || 10);
  const [status, setStatus] = useState<ProductStatus>(product?.status || 'active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (product) {
      updateProduct(product.id, {
        sku,
        name,
        category,
        unit,
        sellingPrice,
        costPrice,
        stock,
        reorderLevel,
        status,
      });
    } else {
      addProduct({
        sku,
        name,
        category,
        unit,
        sellingPrice,
        costPrice,
        stock,
        reorderLevel,
        status,
      });
    }
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.75rem',
          maxWidth: '540px',
          width: '90%',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>
            {product ? 'Edit Product Item' : 'Create New Product'}
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748B' }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                SKU Code *
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                Product Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              >
                <option value="Hardware">Hardware</option>
                <option value="Peripherals">Peripherals</option>
                <option value="Networking">Networking</option>
                <option value="Electronics">Electronics</option>
                <option value="Software">Software</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                Unit of Measure
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                Selling Price (₹) *
              </label>
              <input
                type="number"
                required
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                Cost Price (₹) *
              </label>
              <input
                type="number"
                required
                value={costPrice}
                onChange={(e) => setCostPrice(Number(e.target.value))}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                Stock Available
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                Reorder Level
              </label>
              <input
                type="number"
                value={reorderLevel}
                onChange={(e) => setReorderLevel(Number(e.target.value))}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProductStatus)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              >
                <option value="active">Active</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: 'white', cursor: 'pointer', fontWeight: 600, color: '#475569' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ padding: '0.5rem 1.25rem', borderRadius: '6px', border: 'none', background: '#3B82F6', color: 'white', cursor: 'pointer', fontWeight: 600 }}
            >
              {product ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
