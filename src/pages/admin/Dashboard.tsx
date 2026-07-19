import { useStore } from '@/store';
import { ShoppingCart, Package, Truck, Users, TrendingUp, AlertCircle } from 'lucide-react';

const stats = [
  { id: 'orders', label: '待处理订单', icon: ShoppingCart, color: 'bg-primary-500' },
  { id: 'products', label: '商品数量', icon: Package, color: 'bg-success-500' },
  { id: 'suppliers', label: '供货商数量', icon: Users, color: 'bg-blue-500' },
  { id: 'purchases', label: '待采购订单', icon: Truck, color: 'bg-purple-500' },
];

export function AdminDashboard() {
  const { orders, products, suppliers, purchases } = useStore();

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const pendingPurchases = purchases.filter(p => p.status === 'pending').length;
  const lowStockProducts = products.filter(p => p.stock < 20).length;

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="flex-1 p-4 md:p-8 bg-gray-50">
      <div className="animate-slideIn">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">控制台</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            let value = 0;
            switch (stat.id) {
              case 'orders':
                value = pendingOrders;
                break;
              case 'products':
                value = products.length;
                break;
              case 'suppliers':
                value = suppliers.length;
                break;
              case 'purchases':
                value = pendingPurchases;
                break;
            }

            return (
              <div
                key={stat.id}
                className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4 hover:shadow-lg transition-shadow"
              >
                <div className={`w-14 h-14 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {lowStockProducts > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-800">库存预警</p>
              <p className="text-amber-600 text-sm mt-1">
                有 {lowStockProducts} 个商品库存不足20件，请及时采购补充。
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">最近订单</h3>
              <button className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                查看全部
              </button>
            </div>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-800">订单 #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary-500">¥{order.total_amount.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {order.status === 'pending' ? '待处理' :
                       order.status === 'processing' ? '处理中' :
                       order.status === 'shipped' ? '已发货' : '已完成'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">销售趋势</h3>
              <TrendingUp className="w-5 h-5 text-success-500" />
            </div>
            <div className="h-48 flex items-end justify-between gap-4">
              {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((day) => {
                const height = Math.random() * 80 + 20;
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-primary-200 rounded-t-lg transition-all hover:bg-primary-300" style={{ height: `${height}%` }}>
                      <div className="w-full h-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg" />
                    </div>
                    <span className="text-xs text-gray-500">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}