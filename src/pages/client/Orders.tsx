import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { Package, ChevronRight, Filter, ShoppingBag } from 'lucide-react';
import type { OrderStatus } from '@/types';

const statusOptions: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待处理' },
  { value: 'processing', label: '处理中' },
  { value: 'shipped', label: '已发货' },
  { value: 'completed', label: '已完成' },
];

export function Orders() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const navigate = useNavigate();
  const { orders, getProductById, user } = useStore();

  const filteredOrders = orders.filter(order => {
    const isCurrentUser = user?.id ? order.customer_id === user.id : order.customer_id === 'guest';
    return isCurrentUser && (statusFilter === 'all' || order.status === statusFilter);
  });

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return '待处理';
      case 'processing': return '处理中';
      case 'shipped': return '已发货';
      case 'completed': return '已完成';
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'completed': return 'bg-green-100 text-green-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">我的订单</h1>
          <button
            onClick={() => navigate('/orders/new')}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>创建订单</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all bg-white"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => navigate(`/orders/${order.id}`)}
              className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="font-medium text-gray-800">订单 #{order.id.slice(0, 8)}</span>
                  <span className="text-gray-400 text-sm ml-3">
                    {new Date(order.created_at).toLocaleString('zh-CN')}
                  </span>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-4">
                {order.items?.slice(0, 3).map((item) => {
                  const product = getProductById(item.product_id);
                  return (
                    <div key={item.id} className="relative">
                      <img
                        src={product?.image_url}
                        alt={product?.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      {order.items && order.items.length > 3 && order.items.indexOf(item) === 2 && (
                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-medium">+{order.items.length - 3}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-gray-500 text-sm">
                  共 {order.items?.length || 0} 件商品
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-primary-500">¥{order.total_amount.toFixed(2)}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无订单数据</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
            >
              去购物
            </button>
          </div>
        )}
      </div>
    </div>
  );
}