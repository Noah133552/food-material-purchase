import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';

export function PurchaseForm() {
  const navigate = useNavigate();
  const { suppliers, products, categories, addPurchase, addSupplier, addProduct } = useStore();

  const [formData, setFormData] = useState({
    supplier_id: '',
    product_id: '',
    quantity: '',
    unit_price: '',
  });

  const [totalAmount, setTotalAmount] = useState(0);

  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contact_name: '',
    phone: '',
    email: '',
    address: '',
  });

  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    unit: '',
    category_id: '',
    image_url: '',
  });

  useEffect(() => {
    const quantity = parseInt(formData.quantity) || 0;
    const unitPrice = parseFloat(formData.unit_price) || 0;
    setTotalAmount(quantity * unitPrice);
  }, [formData.quantity, formData.unit_price]);

  const handleSupplierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'new') {
      setShowAddSupplierModal(true);
    } else {
      setFormData({ ...formData, supplier_id: e.target.value });
    }
  };

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSupplier.name || !newSupplier.contact_name || !newSupplier.phone) {
      alert('请填写供货商名称、联系人姓名和联系电话');
      return;
    }

    const newlyAddedSupplier = addSupplier(newSupplier);
    setFormData({ ...formData, supplier_id: newlyAddedSupplier.id });
    setShowAddSupplierModal(false);
    setNewSupplier({ name: '', contact_name: '', phone: '', email: '', address: '' });
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'new') {
      setShowAddProductModal(true);
    } else {
      setFormData({ ...formData, product_id: e.target.value });
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProduct.name || !newProduct.price || !newProduct.category_id) {
      alert('请填写商品名称、价格和分类');
      return;
    }

    const productData = {
      ...newProduct,
      price: parseFloat(newProduct.price) || 0,
      stock: parseInt(newProduct.stock) || 0,
      image_url: newProduct.image_url || `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(newProduct.name)}&image_size=square`,
    };

    const newlyAddedProduct = addProduct(productData);
    setFormData({ ...formData, product_id: newlyAddedProduct.id });
    setShowAddProductModal(false);
    setNewProduct({ name: '', description: '', price: '', stock: '', unit: '', category_id: '', image_url: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const purchaseData = {
      ...formData,
      quantity: parseInt(formData.quantity) || 0,
      unit_price: parseFloat(formData.unit_price) || 0,
      total_amount: totalAmount,
      status: 'pending' as const,
    };

    if (!purchaseData.supplier_id || !purchaseData.product_id || purchaseData.quantity <= 0) {
      alert('请填写必填字段');
      return;
    }

    addPurchase(purchaseData);
    navigate('/admin/purchases');
  };

  return (
    <div className="flex-1 p-4 md:p-8 bg-gray-50 animate-slideIn">
      <button onClick={() => navigate('/admin/purchases')} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
        <ArrowLeft className="w-5 h-5" />
        <span>返回采购单列表</span>
      </button>

      <div className="bg-white rounded-xl shadow-md p-6 md:p-8 max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">新建采购单</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">选择供货商 *</label>
            <select
              value={formData.supplier_id}
              onChange={handleSupplierChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all bg-white"
            >
              <option value="">请选择供货商</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name} ({supplier.contact_name})
                </option>
              ))}
              <option value="new">
                <div className="flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  <span>创建新供货商...</span>
                </div>
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">选择商品 *</label>
            <select
              value={formData.product_id}
              onChange={handleProductChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all bg-white"
            >
              <option value="">请选择商品</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} (库存: {product.stock})
                </option>
              ))}
              <option value="new">
                <div className="flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  <span>创建新商品...</span>
                </div>
              </option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">采购数量 *</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="0"
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">采购单价 (¥)</label>
              <input
                type="number"
                value={formData.unit_price}
                onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
              />
            </div>
          </div>

          <div className="bg-primary-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">采购总额</span>
              <span className="text-2xl font-bold text-primary-500">¥{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/purchases')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              <Save className="w-5 h-5" />
              <span>创建采购单</span>
            </button>
          </div>
        </form>
      </div>

      {showAddSupplierModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">创建新供货商</h3>
              <button
                onClick={() => setShowAddSupplierModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSupplier} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  供货商名称 *
                </label>
                <input
                  type="text"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  placeholder="请输入供货商名称"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  联系人姓名 *
                </label>
                <input
                  type="text"
                  value={newSupplier.contact_name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, contact_name: e.target.value })}
                  placeholder="请输入联系人姓名"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  联系电话 *
                </label>
                <input
                  type="tel"
                  value={newSupplier.phone}
                  onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                  placeholder="请输入联系电话"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  邮箱
                </label>
                <input
                  type="email"
                  value={newSupplier.email}
                  onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                  placeholder="请输入邮箱地址"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  地址
                </label>
                <input
                  type="text"
                  value={newSupplier.address}
                  onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                  placeholder="请输入地址"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddSupplierModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>创建供货商</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">创建新商品</h3>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  商品名称 *
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="请输入商品名称"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  商品分类 *
                </label>
                <select
                  value={newProduct.category_id}
                  onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all bg-white"
                >
                  <option value="">请选择分类</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  商品描述
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="请输入商品描述"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    价格 (¥) *
                  </label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    库存数量
                  </label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    库存单位
                  </label>
                  <input
                    type="text"
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                    placeholder="如：斤、袋"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  商品图片URL
                </label>
                <input
                  type="url"
                  value={newProduct.image_url}
                  onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                  placeholder="留空自动生成"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all text-sm"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>创建商品</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}