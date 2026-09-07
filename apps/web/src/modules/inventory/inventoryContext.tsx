import React, { createContext, useContext, useState } from 'react';
import {
  Product,
  Warehouse,
  WarehouseStock,
  StockMovement,
  StockMovementType,
  StockAvailabilityCheck,
} from '../../types/inventory';
import {
  MOCK_PRODUCTS,
  MOCK_WAREHOUSES,
  MOCK_WAREHOUSE_STOCKS,
  MOCK_MOVEMENTS,
} from '../../mock-data/inventory';
import { SalesItem } from '../../types/sales';

interface InventoryContextType {
  products: Product[];
  warehouses: Warehouse[];
  stocks: WarehouseStock[];
  movements: StockMovement[];

  // Product CRUD
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, fields: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Warehouse CRUD
  addWarehouse: (warehouse: Omit<Warehouse, 'id' | 'code'>) => Warehouse;
  updateWarehouse: (id: string, fields: Partial<Warehouse>) => void;

  // Movement & Fulfillment
  recordMovement: (movement: Omit<StockMovement, 'id' | 'date'>) => StockMovement;
  checkStockAvailability: (items: SalesItem[]) => StockAvailabilityCheck[];
  reserveAndFulfillOrder: (orderCode: string, items: SalesItem[], warehouseId?: string) => boolean;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [warehouses] = useState<Warehouse[]>(MOCK_WAREHOUSES);
  const [stocks, setStocks] = useState<WarehouseStock[]>(MOCK_WAREHOUSE_STOCKS);
  const [movements, setMovements] = useState<StockMovement[]>(MOCK_MOVEMENTS);

  // --- PRODUCTS ---
  const addProduct = (pData: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newProd: Product = {
      ...pData,
      id: `prod-${Date.now()}`,
      createdAt: new Date(),
    };
    setProducts((prev) => [newProd, ...prev]);
    return newProd;
  };

  const updateProduct = (id: string, fields: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...fields } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // --- WAREHOUSES ---
  const addWarehouse = (wData: Omit<Warehouse, 'id' | 'code'>): Warehouse => {
    const newWh: Warehouse = {
      ...wData,
      id: `wh-${Date.now()}`,
      code: `WH-${wData.name.substring(0, 3).toUpperCase()}`,
    };
    return newWh;
  };

  const updateWarehouse = (id: string, fields: Partial<Warehouse>) => {
    // Read-only for mock
  };

  // --- MOVEMENTS & FULFILLMENT ---
  const recordMovement = (mData: Omit<StockMovement, 'id' | 'date'>): StockMovement => {
    const newMovement: StockMovement = {
      ...mData,
      id: `sm-${Date.now()}`,
      date: new Date(),
    };

    setMovements((prev) => [newMovement, ...prev]);

    // Update Product Stock Count
    setProducts((prev) =>
      prev.map((p) =>
        p.id === mData.productId
          ? { ...p, stock: Math.max(0, p.stock + mData.quantity) }
          : p
      )
    );

    // Update Warehouse Stock Count
    setStocks((prev) =>
      prev.map((s) => {
        if (s.productId === mData.productId && s.warehouseId === mData.warehouseId) {
          const newAvail = Math.max(0, s.available + mData.quantity);
          return {
            ...s,
            available: newAvail,
            total: newAvail + s.reserved,
          };
        }
        return s;
      })
    );

    return newMovement;
  };

  // Check Availability for Sales Order Items
  const checkStockAvailability = (items: SalesItem[]): StockAvailabilityCheck[] => {
    return items.map((item) => {
      // Find matching product
      const matchedProd = products.find(
        (p) => p.name.toLowerCase() === item.productName.toLowerCase()
      );

      const availableQty = matchedProd ? matchedProd.stock : 0;
      const isAvailable = availableQty >= item.quantity;

      return {
        productId: matchedProd?.id || 'unknown',
        productName: item.productName,
        requiredQty: item.quantity,
        availableQty,
        isAvailable,
        warehouseName: 'Mumbai Central Hub',
      };
    });
  };

  // Execute Stock Reservation & Sale Movement for Sales Order
  const reserveAndFulfillOrder = (orderCode: string, items: SalesItem[], targetWarehouseId = 'wh-1'): boolean => {
    const targetWh = warehouses.find((w) => w.id === targetWarehouseId) || warehouses[0];

    items.forEach((item) => {
      const matchedProd = products.find(
        (p) => p.name.toLowerCase() === item.productName.toLowerCase()
      );

      const prodId = matchedProd?.id || `prod-1`;
      const sku = matchedProd?.sku || `SKU-ORD`;

      recordMovement({
        productId: prodId,
        productName: item.productName,
        sku,
        warehouseId: targetWh.id,
        warehouseName: targetWh.name,
        type: 'Sale',
        quantity: -item.quantity,
        referenceCode: orderCode,
        notes: `Reserved & dispatched for Sales Order ${orderCode}`,
      });
    });

    return true;
  };

  return (
    <InventoryContext.Provider
      value={{
        products,
        warehouses,
        stocks,
        movements,
        addProduct,
        updateProduct,
        deleteProduct,
        addWarehouse,
        updateWarehouse,
        recordMovement,
        checkStockAvailability,
        reserveAndFulfillOrder,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
