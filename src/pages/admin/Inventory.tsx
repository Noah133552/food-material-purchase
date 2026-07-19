import { useState } from 'react';
import { useStore } from '@/store';
import { Search, Package, Warehouse, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

export function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'materials'>('products');
  const { products, categories, purchases, getProductById, getSupplierById, getReservedQuantity } = useStore();

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || '未分类';
  };

  const getAvailableStock = (productId: string, stock: number) => {
    const reserved = getReservedQuantity(productId);
    return stock - reserved;
  };

  const productInventory = products.map(product => {
    const reserved = getReservedQuantity(product.id);
    const available = getAvailableStock(product.id, product.stock);
    return {
      ...product,
      reserved,
      available,
      categoryName: getCategoryName(product.category_id),
    };
  });

  const materialInventory = purchases
    .filter(p => p.status === 'received')
    .map(purchase => {
      const product = getProductById(purchase.product_id);
      const supplier = getSupplierById(purchase.supplier_id);
      return {
        ...purchase,
        productName: product?.name || '未知商品',
        supplierName: supplier?.name || '未知供货商',
        unit: product?.unit || '件',
      };
    });

  const filteredProducts = productInventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMaterials = materialInventory.filter(item =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 p-4 md:p-8 bg-gray-50 animate-slideIn">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">库存管理</h2>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索商品名称或分类..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
            />
          </div>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'products'
                  ? 'bg-white shadow text-primary-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Package className="w-5 h-5" />
              <span>商品库存</span>
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'materials'
                  ? 'bg-white shadow text-primary-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Warehouse className="w-5 h-5" />
              <span>原材料库存</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'products' ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">商品名称</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">分类</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">单位</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">当前库存</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">已预订</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">可用库存</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((item) => {
                  const isLowStock = item.available < 10;
                  const isOutOfStock = item.available <= 0;
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {item.image_url && (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-10 h-10 object-cover rounded-lg"
                            />
                          )}
                          <span className="font-medium text-gray-800">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                          {item.categoryName}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center text-gray-600">{item.unit}</td>
                      <td className="px-4 py-4 text-center">
                        <span className="font-semibold text-gray-800">{item.stock}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                          item.reserved > 0
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          <TrendingDown className="w-4 h-4 mr-1" />
                          {item.reserved}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`font-semibold ${
                          isOutOfStock ? 'text-red-500' : isLowStock ? 'text-amber-500' : 'text-green-600'
                        }`}>
                          {item.available}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            已售罄
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-600">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            库存不足
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            充足
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">暂无商品库存数据</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">商品名称</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">供货商</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">单位</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">采购数量</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">单价</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">总金额</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">入库时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMaterials.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <span className="font-medium text-gray-800">{item.productName}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600">{item.supplierName}</span>
                    </td>
                    <td className="px-4 py-4 text-center text-gray-600">{item.unit}</td>
                    <td className="px-4 py-4 text-center">
                      <span className="font-semibold text-gray-800">{item.quantity}</span>
                    </td>
                    <td className="px-4 py-4 text-center text-gray-600">¥{item.unit_price.toFixed(2)}</td>
                    <td className="px-4 py-4 text-center">
                      <span className="font-semibold text-primary-500">¥{item.total_amount.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-gray-500">
                      {new Date(item.created_at).toLocaleDateString('zh-CN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMaterials.length === 0 && (
            <div className="p-12 text-center">
              <Warehouse className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">暂无原材料库存数据</p>
              <p className="text-gray-400 text-sm mt-1">采购单确认收货后会自动入库</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}