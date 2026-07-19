import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { ArrowLeft, Package, Users, DollarSign, CheckCircle } from 'lucide-react';
import type { PurchaseStatus } from '@/types';

const statusTransitions: { from: PurchaseStatus; to: PurchaseStatus; label: string }[] = [
  { from: 'pending', to: 'approved', label: '审批通过' },
  { from: 'approved', to: 'shipped', label: '确认发货' },
  { from: 'shipped', to: 'received', label: '确认收货' },
];

export function PurchaseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPurchaseById, getSupplierById, getProductById, updatePurchaseStatus } = useStore();

  const purchase = getPurchaseById(id || '');
  const supplier = purchase ? getSupplierById(purchase.supplier_id) : null;
  const product = purchase ? getProductById(purchase.product_id) : null;
  const availableTransitions = statusTransitions.filter(t => t.from === purchase?.status);

  const handleStatusChange = (newStatus: PurchaseStatus) => {
    if (purchase) {
      updatePurchaseStatus(purchase.id, newStatus);
    }
  };

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

  if (!purchase) {
    return (
      <div className="flex-1 p-8 bg-gray-50">
        <button onClick={() => navigate('/admin/purchases')} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
          <ArrowLeft className="w-5 h-5" />
          <span>返回采购单列表</span>
        </button>
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-gray-500">采购单不存在</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-gray-50 animate-slideIn">
      <button onClick={() => navigate('/admin/purchases')} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
        <ArrowLeft className="w-5 h-5" />
        <span>返回采购单列表</span>
      </button>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">采购单详情</h2>
              <p className="text-gray-500 mt-1">采购单号: #{purchase.id}</p>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(purchase.status)}`}>
              {getStatusText(purchase.status)}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Package className="w-4 h-4" />
                <span className="text-sm font-medium">采购商品</span>
              </div>
              <div className="flex items-center gap-3">
                {product?.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                )}
                <div>
                  <p className="font-medium text-gray-800">{product?.name || '未知商品'}</p>
                  <p className="text-sm text-gray-500">分类: {product?.category_id}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">供货商</span>
              </div>
              <div>
                <p className="font-medium text-gray-800">{supplier?.name || '未知供货商'}</p>
                <p className="text-sm text-gray-500 mt-1">联系人: {supplier?.contact_name}</p>
                <p className="text-sm text-gray-500">电话: {supplier?.phone}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <DollarSign className="w-6 h-6 text-primary-500 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">采购数量</p>
              <p className="text-xl font-bold text-gray-800">{purchase.quantity}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <DollarSign className="w-6 h-6 text-primary-500 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">采购单价</p>
              <p className="text-xl font-bold text-gray-800">¥{purchase.unit_price.toFixed(2)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <DollarSign className="w-6 h-6 text-primary-500 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">采购总额</p>
              <p className="text-xl font-bold text-primary-500">¥{purchase.total_amount.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
            <div>
              <p className="text-gray-500 text-sm">创建时间</p>
              <p className="text-gray-800">{new Date(purchase.created_at).toLocaleString('zh-CN')}</p>
            </div>
            {purchase.updated_at !== purchase.created_at && (
              <div className="text-right">
                <p className="text-gray-500 text-sm">更新时间</p>
                <p className="text-gray-800">{new Date(purchase.updated_at).toLocaleString('zh-CN')}</p>
              </div>
            )}
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

          {purchase.status === 'received' && (
            <div className="mt-6 flex items-center gap-2 p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-700 font-medium">采购已完成，商品已入库</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}