import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { ShoppingCart, Minus, Plus, ArrowLeft, Star, AlertCircle } from 'lucide-react';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById, getCategoryById, addToCart } = useStore();

  const product = getProductById(id || '');
  const category = product ? getCategoryById(product.category_id) : null;
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
            <ArrowLeft className="w-5 h-5" />
            <span>返回首页</span>
          </button>
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500">商品不存在</p>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert(`已添加 ${product.name} x${quantity} 到购物车`);
    navigate('/');
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/orders/new');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
          <ArrowLeft className="w-5 h-5" />
          <span>返回首页</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-80 lg:h-96 object-cover"
            />
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm px-3 py-1 bg-primary-100 text-primary-600 rounded-full">
                {category?.name || '未分类'}
              </span>
              {product.stock < 20 && (
                <span className="text-sm px-3 py-1 bg-amber-100 text-amber-600 rounded-full flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  库存紧张
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-gray-500 text-sm">4.9 (128条评价)</span>
            </div>

            <p className="text-gray-600 mb-6">{product.description}</p>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-primary-500">¥{product.price.toFixed(2)}</span>
              <span className="text-gray-400 line-through">¥{(product.price * 1.2).toFixed(2)}</span>
              <span className="px-2 py-1 bg-red-100 text-red-600 text-sm rounded">限时特惠</span>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-gray-600">数量:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100 rounded-l-lg transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="px-6 py-2 text-lg font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-2 hover:bg-gray-100 rounded-r-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <span className="text-gray-400 text-sm">库存: {product.stock} 件</span>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary-500 text-primary-500 font-medium rounded-lg hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>加入购物车</span>
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                <span>立即购买</span>
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-3">商品详情</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                  <span>精选优质原材料，品质保证</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                  <span>产地直供，新鲜直达</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                  <span>严格质检，安全放心</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}