import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { ArrowLeft, MapPin, Clock, CheckCircle } from 'lucide-react';
import type { OrderStatus } from '@/types';

const statusTransitions: { from: OrderStatus; to: OrderStatus; label: string }[] = [
  { from: 'pending', to: 'processing', label: '开始处理' },
  { from: 'processing', to: 'shipped', label: '确认发货' },
  { from: 'shipped', to: 'completed', label: '确认完成' },
];

export function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrderById, getProductById, updateOrderStatus } = useStore();

  const order = getOrderById(id || '');
  const availableTransitions = statusTransitions.filter(t => t.from === order?.status);

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (order) {
      updateOrderStatus(order.id, newStatus);
    }
  };

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

  if (!order) {
    return (
      <div className="flex-1 p-8 bg-gray-50">
        <button onClick={() => navigate('/admin/orders')} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
          <ArrowLeft className="w-5 h-5" />
          <span>返回订单列表</span>
        </button>
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-gray-500">订单不存在</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-gray-50 animate-slideIn">
      <button onClick={() => navigate('/admin/orders')} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
        <ArrowLeft className="w-5 h-5" />
        <span>返回订单列表</span>
      </button>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">订单详情</h2>
              <p className="text-gray-500 mt-1">订单号: #{order.id}</p>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {getStatusText(order.status)}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">创建时间</span>
              </div>
              <p className="text-gray-800">{new Date(order.created_at).toLocaleString('zh-CN')}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">配送地址</span>
              </div>
              <p className="text-gray-800">{order.shipping_address}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">商品明细</h3>
            <div className="space-y-3">
              {order.items?.map((item) => {
                const product = getProductById(item.product_id);
                return (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    {product?.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{product?.name || '未知商品'}</p>
                      <p className="text-sm text-gray-500">单价: ¥{item.unit_price.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600">x{item.quantity}</p>
                      <p className="font-semibold text-primary-500">¥{item.total_amount.toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
            <span className="text-gray-600">订单总额</span>
            <span className="text-2xl font-bold text-primary-500">¥{order.total_amount.toFixed(2)}</span>
          </div>

          {availableTransitions.length > 0 && (
            <div className="mt-6 flex gap-3">
              {availableTransitions.map((transition) => (
                <button
                  key={transition.to}
                  onClick={() => handleStatusChange(transition.to)}
                  className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>{transition.label}</span>
                </button>
              ))}
            </div>
          )}

          {order.status === 'completed' && (
            <div className="mt-6 flex items-center gap-2 p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-700 font-medium">订单已完成</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}