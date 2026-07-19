import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { Search, Plus, Edit, Trash2, Users, Phone, Mail, MapPin } from 'lucide-react';

export function AdminSuppliers() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { suppliers, deleteSupplier } = useStore();

  const filteredSuppliers = suppliers.filter((supplier) => {
    return supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           supplier.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           supplier.phone.includes(searchTerm) ||
           supplier.address.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleDelete = (supplierId: string, supplierName: string) => {
    if (confirm(`确定要删除供货商 "${supplierName}" 吗？`)) {
      deleteSupplier(supplierId);
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8 bg-gray-50 animate-slideIn">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">供货商管理</h2>
        <button
          onClick={() => navigate('/admin/suppliers/new')}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>新增供货商</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索供货商名称、联系人或电话..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{supplier.name}</h3>
                  <p className="text-sm text-gray-500">联系人: {supplier.contact_name}</p>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{supplier.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 truncate">{supplier.email}</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">{supplier.address}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">
                  创建于 {new Date(supplier.created_at).toLocaleDateString('zh-CN')}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/admin/suppliers/${supplier.id}`)}
                    className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                    title="编辑"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(supplier.id, supplier.name)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">暂无供货商数据</p>
        </div>
      )}
    </div>
  );
}