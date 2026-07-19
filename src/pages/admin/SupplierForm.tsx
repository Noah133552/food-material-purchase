import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { ArrowLeft, Save } from 'lucide-react';

export function SupplierForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSupplierById, addSupplier, updateSupplier } = useStore();

  const isEdit = !!id;
  const existingSupplier = isEdit ? getSupplierById(id) : null;

  const [formData, setFormData] = useState({
    name: '',
    contact_name: '',
    phone: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    if (existingSupplier) {
      setFormData({
        name: existingSupplier.name,
        contact_name: existingSupplier.contact_name,
        phone: existingSupplier.phone,
        email: existingSupplier.email,
        address: existingSupplier.address,
      });
    }
  }, [existingSupplier]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.contact_name || !formData.phone) {
      alert('请填写必填字段');
      return;
    }

    if (isEdit && existingSupplier) {
      updateSupplier(existingSupplier.id, formData);
    } else {
      addSupplier(formData);
    }

    navigate('/admin/suppliers');
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 animate-slideIn">
      <button onClick={() => navigate('/admin/suppliers')} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
        <ArrowLeft className="w-5 h-5" />
        <span>返回供货商列表</span>
      </button>

      <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {isEdit ? '编辑供货商' : '新增供货商'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">供货商名称 *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="请输入供货商名称"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">联系人 *</label>
              <input
                type="text"
                value={formData.contact_name}
                onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                placeholder="请输入联系人姓名"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">联系电话 *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="请输入联系电话"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">电子邮箱</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="请输入电子邮箱"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">联系地址</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="请输入联系地址"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all resize-none"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/suppliers')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              <Save className="w-5 h-5" />
              <span>{isEdit ? '保存修改' : '创建供货商'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}