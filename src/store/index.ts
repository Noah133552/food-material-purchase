import { create } from 'zustand';
import type { CartItem, User, Order, Product, Category, Supplier, Purchase } from '@/types';
import { mockProducts, mockCategories, mockSuppliers, mockPurchases, mockOrders } from '@/data/mockData';

const mockUsers: User[] = [
  {
    id: 'merchant1',
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    name: '管理员',
    role: 'merchant',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'customer1',
    username: 'customer1',
    email: 'customer1@example.com',
    password: '123456',
    name: '客户1',
    role: 'customer',
    created_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 'customer2',
    username: 'customer2',
    email: 'customer2@example.com',
    password: '654321',
    name: '客户2',
    role: 'customer',
    created_at: '2024-01-03T00:00:00Z',
  },
];

interface Store {
  user: User | null;
  isLoggedIn: boolean;
  cart: CartItem[];
  products: Product[];
  categories: Category[];
  suppliers: Supplier[];
  purchases: Purchase[];
  orders: Order[];
  users: User[];
  
  login: (usernameOrEmail: string, password: string, role: 'customer' | 'merchant') => { success: boolean; message: string };
  logout: () => void;
  register: (username: string, email: string, password: string, name: string, role: 'customer') => { success: boolean; message: string };
  
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  createOrder: (items: CartItem[], shippingAddress: string) => Order | null;
  
  getProductById: (id: string) => Product | undefined;
  getCategoryById: (id: string) => Category | undefined;
  getSupplierById: (id: string) => Supplier | undefined;
  getPurchaseById: (id: string) => Purchase | undefined;
  getOrderById: (id: string) => Order | undefined;
  getUserById: (id: string) => User | undefined;
  
  getReservedQuantity: (productId: string) => number;
  
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updatePurchaseStatus: (purchaseId: string, status: Purchase['status']) => void;
  
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  addSupplier: (supplier: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>) => Supplier;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  
  addPurchase: (purchase: Omit<Purchase, 'id' | 'created_at' | 'updated_at'>) => void;
  
  deleteUser: (userId: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

export const useStore = create<Store>((set, get) => ({
  user: null,
  isLoggedIn: false,
  cart: [],
  products: mockProducts,
  categories: mockCategories,
  suppliers: mockSuppliers,
  purchases: mockPurchases,
  orders: mockOrders,
  users: mockUsers,
  
  login: (usernameOrEmail, password, role) => {
    const users = get().users;
    const user = users.find(u => 
      (u.username === usernameOrEmail || u.email === usernameOrEmail) && 
      u.password === password && 
      u.role === role
    );
    
    if (user) {
      set({
        user,
        isLoggedIn: true,
      });
      return { success: true, message: '登录成功' };
    }
    
    return { success: false, message: '用户名/邮箱或密码错误' };
  },
  
  logout: () => {
    set({ user: null, isLoggedIn: false, cart: [] });
  },
  
  register: (username, email, password, name, role) => {
    const users = get().users;
    
    if (users.find(u => u.username === username)) {
      return { success: false, message: '用户名已存在' };
    }
    
    if (users.find(u => u.email === email)) {
      return { success: false, message: '邮箱已被注册' };
    }
    
    if (password.length < 6) {
      return { success: false, message: '密码至少需要6位' };
    }
    
    const newUser: User = {
      id: generateId(),
      username,
      email,
      password,
      name: name || username,
      role,
      created_at: new Date().toISOString(),
    };
    
    set((state) => ({ users: [...state.users, newUser] }));
    
    return { success: true, message: '注册成功' };
  },
  
  addToCart: (product, quantity) => {
    set((state) => {
      const existingItem = state.cart.find(item => item.product.id === product.id);
      if (existingItem) {
        return {
          cart: state.cart.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      return { cart: [...state.cart, { product, quantity }] };
    });
  },
  
  removeFromCart: (productId) => {
    set((state) => ({
      cart: state.cart.filter(item => item.product.id !== productId),
    }));
  },
  
  updateCartQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set((state) => ({
      cart: state.cart.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    }));
  },
  
  clearCart: () => set({ cart: [] }),
  
  createOrder: (items, shippingAddress) => {
    if (items.length === 0) return null;
    
    const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const customerId = get().user?.id || 'guest';
    const newOrder: Order = {
      id: generateId(),
      customer_id: customerId,
      total_amount: totalAmount,
      status: 'pending',
      shipping_address: shippingAddress,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: items.map(item => ({
        id: generateId(),
        order_id: '',
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.product.price,
        total_amount: item.product.price * item.quantity,
      })),
    };
    
    (newOrder.items || []).forEach(item => {
      item.order_id = newOrder.id;
    });
    
    set((state) => ({
      orders: [newOrder, ...state.orders],
      cart: [],
    }));
    
    return newOrder;
  },
  
  getProductById: (id) => get().products.find(p => p.id === id),
  getCategoryById: (id) => get().categories.find(c => c.id === id),
  getSupplierById: (id) => get().suppliers.find(s => s.id === id),
  getPurchaseById: (id) => get().purchases.find(p => p.id === id),
  getOrderById: (id) => get().orders.find(o => o.id === id),
  getUserById: (id) => get().users.find(u => u.id === id),
  
  getReservedQuantity: (productId) => {
    const orders = get().orders;
    return orders.reduce((total, order) => {
      if (order.status === 'completed') return total;
      const item = order.items?.find(i => i.product_id === productId);
      return total + (item?.quantity || 0);
    }, 0);
  },
  
  updateOrderStatus: (orderId, status) => {
    set((state) => {
      const order = state.orders.find(o => o.id === orderId);
      let updatedProducts = state.products;
      
      if (order && status === 'completed' && order.status !== 'completed') {
        updatedProducts = state.products.map(product => {
          const orderItem = order.items?.find(item => item.product_id === product.id);
          if (orderItem) {
            return {
              ...product,
              stock: Math.max(0, product.stock - orderItem.quantity),
              updated_at: new Date().toISOString(),
            };
          }
          return product;
        });
      }
      
      return {
        orders: state.orders.map(order =>
          order.id === orderId
            ? { ...order, status, updated_at: new Date().toISOString() }
            : order
        ),
        products: updatedProducts,
      };
    });
  },
  
  updatePurchaseStatus: (purchaseId, status) => {
    set((state) => ({
      purchases: state.purchases.map(purchase =>
        purchase.id === purchaseId
          ? { ...purchase, status, updated_at: new Date().toISOString() }
          : purchase
      ),
    }));
  },
  
  addProduct: (product) => {
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...product,
      id: generateId(),
      created_at: now,
      updated_at: now,
    };
    set((state) => ({ products: [...state.products, newProduct] }));
    return newProduct;
  },
  
  updateProduct: (id, updates) => {
    set((state) => ({
      products: state.products.map(product =>
        product.id === id
          ? { ...product, ...updates, updated_at: new Date().toISOString() }
          : product
      ),
    }));
  },
  
  deleteProduct: (id) => {
    set((state) => ({ products: state.products.filter(p => p.id !== id) }));
  },
  
  addSupplier: (supplier) => {
    const now = new Date().toISOString();
    const newSupplier: Supplier = {
      ...supplier,
      id: generateId(),
      created_at: now,
      updated_at: now,
    };
    set((state) => ({ suppliers: [...state.suppliers, newSupplier] }));
    return newSupplier;
  },
  
  updateSupplier: (id, updates) => {
    set((state) => ({
      suppliers: state.suppliers.map(supplier =>
        supplier.id === id
          ? { ...supplier, ...updates, updated_at: new Date().toISOString() }
          : supplier
      ),
    }));
  },
  
  deleteSupplier: (id) => {
    set((state) => ({ suppliers: state.suppliers.filter(s => s.id !== id) }));
  },
  
  addPurchase: (purchase) => {
    const now = new Date().toISOString();
    const newPurchase: Purchase = {
      ...purchase,
      id: generateId(),
      created_at: now,
      updated_at: now,
    };
    set((state) => ({ purchases: [newPurchase, ...state.purchases] }));
  },
  
  deleteUser: (userId) => {
    set((state) => ({ users: state.users.filter(u => u.id !== userId) }));
  },
}));