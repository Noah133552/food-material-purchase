import { Routes, Route, Outlet } from 'react-router-dom';
import { Navbar } from '@/components/client/Navbar';
import { Sidebar } from '@/components/admin/Sidebar';
import { AdminLogin } from '@/pages/admin/Login';
import { AdminDashboard } from '@/pages/admin/Dashboard';
import { AdminOrders } from '@/pages/admin/Orders';
import { AdminOrderDetail } from '@/pages/admin/OrderDetail';
import { AdminProducts } from '@/pages/admin/Products';
import { ProductForm } from '@/pages/admin/ProductForm';
import { AdminPurchases } from '@/pages/admin/Purchases';
import { PurchaseDetail } from '@/pages/admin/PurchaseDetail';
import { PurchaseForm } from '@/pages/admin/PurchaseForm';
import { AdminSuppliers } from '@/pages/admin/Suppliers';
import { SupplierForm } from '@/pages/admin/SupplierForm';
import { AdminUsers } from '@/pages/admin/Users';
import { Inventory } from '@/pages/admin/Inventory';
import { Home } from '@/pages/client/Home';
import { ProductDetail } from '@/pages/client/ProductDetail';
import { Orders } from '@/pages/client/Orders';
import { OrderDetail as ClientOrderDetail } from '@/pages/client/OrderDetail';
import { OrderForm } from '@/pages/client/OrderForm';
import { Login } from '@/pages/client/Login';

function AdminLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-100 min-h-screen lg:pt-0 lg:pr-0">
        <div className="pt-16 pr-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function ClientLayout() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <Outlet />
      </main>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/:id" element={<AdminOrderDetail />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id" element={<ProductForm />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="purchases" element={<AdminPurchases />} />
        <Route path="purchases/new" element={<PurchaseForm />} />
        <Route path="purchases/:id" element={<PurchaseDetail />} />
        <Route path="suppliers" element={<AdminSuppliers />} />
        <Route path="suppliers/new" element={<SupplierForm />} />
        <Route path="suppliers/:id" element={<SupplierForm />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Login />} />
      <Route path="/" element={<ClientLayout />}>
        <Route index element={<Home />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/new" element={<OrderForm />} />
        <Route path="orders/:id" element={<ClientOrderDetail />} />
      </Route>
    </Routes>
  );
}

export default App;