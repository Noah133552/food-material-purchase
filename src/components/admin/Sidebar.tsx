import { useState } from 'react';
import { LayoutDashboard, ShoppingCart, Package, Truck, Users, LogOut, Menu, X, User, Warehouse } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';

const navItems = [
  { id: 'dashboard', label: '控制台', icon: LayoutDashboard, path: '/admin/dashboard' },
  { id: 'orders', label: '订单管理', icon: ShoppingCart, path: '/admin/orders' },
  { id: 'products', label: '商品品类', icon: Package, path: '/admin/products' },
  { id: 'inventory', label: '库存管理', icon: Warehouse, path: '/admin/inventory' },
  { id: 'purchases', label: '原料采购', icon: Truck, path: '/admin/purchases' },
  { id: 'suppliers', label: '供货商管理', icon: Users, path: '/admin/suppliers' },
  { id: 'users', label: '用户管理', icon: User, path: '/admin/users' },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useStore();
  const currentPath = window.location.pathname;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white min-h-screen flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-primary-400">食材采购系统</h1>
            <p className="text-gray-400 text-sm mt-1">商家管理后台</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 hover:bg-gray-800 rounded"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path || currentPath.startsWith(item.path + '/');
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="text-sm text-gray-400 mb-4">
            <p>当前用户: {user?.email}</p>
            <p className="text-xs mt-1">商家管理员</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">退出登录</span>
          </button>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}