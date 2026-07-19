import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { Search, Plus, Eye, ArrowRight, Filter, Truck } from 'lucide-react';
import type { PurchaseStatus } from '@/types';

const statusOptions: { value: PurchaseStatus | 'all'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待审批' },
  { value: 'approved', label: '已审批' },
  { value: 'shipped', label: '已发货' },
  { value: 'received', label: '已收货' },
];

export function AdminPurchases() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PurchaseStatus | 'all'>('all');
  const navigate = useNavigate();
  const { purchases, getSupplierById, getProductById } = useStore();

  const filteredPurchases = purchases.filter((purchase) => {
    const supplier = getSupplierById(purchase.supplier_id);
    const product = getProductById(purchase.product_id);
    const matchesSearch = purchase.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || purchase.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusText = (status: PurchaseStatus) => {
    switch (status) {
      case 'pending': return '待审批';
      case 'approved': return '已审批';
      case 'shipped': return '已发货';
      case 'received': return '已收货';
    }
  };

  const getStatusColor = (status: PurchaseStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'approved': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'received': return 'bg-green-100 text-green-700';
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8 bg-gray-50 animate-slideIn">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">原料采购管理</h2>
        <button
          onClick={() => navigate('/admin/purchases/new')}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>新建采购单</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索采购单号、供货商或商品..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as PurchaseStatus | 'all')}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all bg-white"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPurchases.map((purchase) => {
          const supplier = getSupplierById(purchase.supplier_id);
          const product = getProductById(purchase.product_id);
          
          return (
            <div
              key={purchase.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">采购单 #{purchase.id.slice(0, 8)}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(purchase.status)}`}>
                    {getStatusText(purchase.status)}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  {product?.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Truck className="w-7 h-7 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-800">{product?.name || '未知商品'}</p>
                    <p className="text-sm text-gray-500">{supplier?.name || '未知供货商'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-500">数量</p>
                    <p className="font-semibold text-gray-800">{purchase.quantity}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-500">单价</p>
                    <p className="font-semibold text-gray-800">¥{purchase.unit_price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-gray-500">总金额</span>
                  <span className="text-lg font-bold text-primary-500">¥{purchase.total_amount.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => navigate(`/admin/purchases/${purchase.id}`)}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-primary-500 hover:text-primary-600 font-medium text-sm transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>查看详情</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPurchases.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">暂无采购单数据</p>
        </div>
      )}
    </div>
  );
}