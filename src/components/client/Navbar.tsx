import { ShoppingCart, Search, User, Menu, X, Store } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { cart, isLoggedIn, user, logout } = useStore();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/?search=${searchTerm}`);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Store className="w-8 h-8 text-primary-500" />
            <h1 className="text-xl font-bold text-gray-800">食材采购系统</h1>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="搜索商品..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                />
              </div>
            </form>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/orders')}
              className="relative p-2 text-gray-600 hover:text-primary-500 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {isLoggedIn ? (
              <div className="relative">
                <button className="flex items-center gap-2 p-2 text-gray-600 hover:text-primary-500 transition-colors">
                  <User className="w-6 h-6" />
                  <span className="hidden sm:inline text-sm font-medium">{user?.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden md:block">
                  <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50">
                    我的订单
                  </button>
                  <button
                    onClick={() => { logout(); navigate('/'); }}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    退出登录
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
              >
                登录
              </button>
            )}

            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="搜索商品..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                />
              </div>
            </form>
            {!isLoggedIn && (
              <button
                onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
                className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
              >
                登录
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}