import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { ArrowLeft, ShoppingCart, Trash2, Minus, Plus, MapPin } from 'lucide-react';

export function OrderForm() {
  const navigate = useNavigate();
  const { cart, updateCartQuantity, removeFromCart, createOrder } = useStore();

  const [shippingAddress, setShippingAddress] = useState('');

  const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
            <ArrowLeft className="w-5 h-5" />
            <span>返回首页</span>
          </button>
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">购物车是空的</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
            >
              去购物
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    if (!shippingAddress.trim()) {
      alert('请填写配送地址');
      return;
    }

    const newOrder = createOrder(cart, shippingAddress);
    if (newOrder) {
      alert(`订单创建成功！订单号: #${newOrder.id.slice(0, 8)}`);
      navigate('/orders');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
          <ArrowLeft className="w-5 h-5" />
          <span>返回首页</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">购物车商品</h2>
              
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">库存: {item.product.stock} 件</p>
                      <p className="text-primary-500 font-semibold mt-1">¥{item.product.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="px-3 py-2 hover:bg-gray-100 rounded-l-lg transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 text-lg font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="px-3 py-2 hover:bg-gray-100 rounded-r-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">订单信息</h2>

              <div className="mb-6">
                <label className="flex items-center gap-2 block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4" />
                  配送地址 *
                </label>
                <textarea
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="请输入详细的配送地址"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all resize-none"
                />
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">商品总数</span>
                  <span className="text-gray-800">{cart.reduce((sum, item) => sum + item.quantity, 0)} 件</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">运费</span>
                  <span className="text-gray-800">免运费</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                  <span className="font-medium text-gray-700">订单总额</span>
                  <span className="text-2xl font-bold text-primary-500">¥{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>确认下单</span>
              </button>

              <p className="text-center text-gray-400 text-sm mt-4">
                下单后商家会尽快处理您的订单
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}