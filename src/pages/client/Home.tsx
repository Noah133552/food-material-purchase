import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { ShoppingCart, AlertCircle, Star } from 'lucide-react';
import type { Product } from '@/types';

export function Home() {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [quantityMap, setQuantityMap] = useState<Record<string, number>>({});
  const navigate = useNavigate();
  const { products, categories, addToCart } = useStore();

  const searchTerm = searchParams.get('search') || '';

  useEffect(() => {
    products.forEach(product => {
      if (!(product.id in quantityMap)) {
        setQuantityMap(prev => ({ ...prev, [product.id]: 1 }));
      }
    });
  }, [products, quantityMap]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || '未分类';
  };

  const handleAddToCart = (product: Product) => {
    const quantity = quantityMap[product.id] || 1;
    addToCart(product, quantity);
    alert(`已添加 ${product.name} x${quantity} 到购物车`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">新鲜食材，品质保证</h1>
          <p className="text-xl opacity-90">为您提供优质的食品原材料，助力您的美食事业</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            全部商品
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all group animate-fadeIn"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.stock < 20 && (
                  <div className="absolute top-3 right-3 bg-amber-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    库存紧张
                  </div>
                )}
                <button
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="text-white font-medium bg-primary-500 px-4 py-2 rounded-lg">查看详情</span>
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                    {getCategoryName(product.category_id)}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm text-gray-500">4.9</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary-500">¥{product.price.toFixed(2)}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantityMap(prev => ({
                          ...prev,
                          [product.id]: Math.max(1, (prev[product.id] || 1) - 1)
                        }))}
                        className="px-2 py-1 hover:bg-gray-100 rounded-l-lg transition-colors"
                      >
                        -
                      </button>
                      <span className="px-2 text-sm font-medium">{quantityMap[product.id] || 1}</span>
                      <button
                        onClick={() => setQuantityMap(prev => ({
                          ...prev,
                          [product.id]: (prev[product.id] || 1) + 1
                        }))}
                        className="px-2 py-1 hover:bg-gray-100 rounded-r-lg transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className="p-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
                      title="加入购物车"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  库存: {product.stock} 件
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-500 text-lg">没有找到符合条件的商品</p>
            <p className="text-gray-400 text-sm mt-1">请尝试其他搜索关键词或分类</p>
          </div>
        )}
      </div>
    </div>
  );
}