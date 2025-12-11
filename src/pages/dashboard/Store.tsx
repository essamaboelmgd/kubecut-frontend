import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, ShoppingCart, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import type { Product } from '@/lib/api';

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'خشب MDF عالي الجودة',
    description: 'لوح خشب MDF بسمك 18مم مناسب للمطابخ',
    price: 850,
    size: '244×122 سم',
    type: 'wood',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
  },
  {
    id: '2',
    name: 'شريط حافة PVC',
    description: 'شريط حافة PVC بعرض 22مم',
    price: 15,
    size: '50 متر',
    type: 'other',
    image: 'https://images.unsplash.com/photo-1586864387789-628af9feed72?w=400',
  },
  {
    id: '3',
    name: 'مفصلات هيدروليك',
    description: 'مفصلات خزانة هيدروليكية مع إغلاق ناعم',
    price: 45,
    size: 'قطعة واحدة',
    type: 'metal',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400',
  },
  {
    id: '4',
    name: 'مقبض ألمنيوم',
    description: 'مقبض خزانة ألمنيوم طول 128مم',
    price: 35,
    size: '128 مم',
    type: 'aluminum',
    image: 'https://images.unsplash.com/photo-1558618047-f4b511d0b435?w=400',
  },
  {
    id: '5',
    name: 'خشب كونتر ملامين',
    description: 'لوح كونتر ملامين أبيض بسمك 16مم',
    price: 650,
    size: '244×122 سم',
    type: 'wood',
    image: 'https://images.unsplash.com/photo-1541123603104-512919d6a96c?w=400',
  },
  {
    id: '6',
    name: 'سكة درج تيليسكوبيك',
    description: 'سكة درج تيليسكوبيك بطول 45سم',
    price: 85,
    size: '45 سم',
    type: 'metal',
    image: 'https://images.unsplash.com/photo-1558618047-f4b511d0b435?w=400',
  },
];

const typeLabels: Record<string, string> = {
  all: 'الكل',
  wood: 'خشب',
  metal: 'حديد',
  aluminum: 'ألمونيوم',
  other: 'أخرى',
};

export default function Store() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart, getCartCount, getCartTotal } = useCart();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [products] = useState<Product[]>(mockProducts);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.includes(search) || p.description.includes(search);
    const matchesType = typeFilter === 'all' || p.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: 'تمت الإضافة',
      description: `تم إضافة "${product.name}" إلى السلة`,
    });
  };

  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">المتجر</h1>
          <p className="mt-1 text-muted-foreground">
            تصفح وشراء المواد والأدوات
          </p>
        </div>
        {cartCount > 0 && (
          <Button variant="hero" onClick={() => navigate('/dashboard/cart')}>
            <ShoppingCart className="h-5 w-5" />
            السلة ({cartCount}) - {cartTotal} ج.م
          </Button>
        )}
      </motion.div>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList>
          <TabsTrigger value="browse">تصفح المنتجات</TabsTrigger>
          <TabsTrigger value="manage">إدارة المنتجات</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="ابحث في المنتجات..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 pr-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-12 w-full sm:w-48">
                <Filter className="ml-2 h-4 w-4" />
                <SelectValue placeholder="النوع" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(typeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          {/* Products Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
                className="glass-card overflow-hidden hover-lift"
              >
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      {typeLabels[product.type]}
                    </span>
                    <span className="text-xs text-muted-foreground">{product.size}</span>
                  </div>
                  <h3 className="mb-1 font-semibold line-clamp-1">{product.name}</h3>
                  <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">{product.price} ج.م</span>
                    <Button size="sm" onClick={() => handleAddToCart(product)}>
                      <Plus className="h-4 w-4" />
                      أضف
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">لا توجد منتجات مطابقة للبحث</p>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="mb-4 text-lg font-semibold">إضافة منتج جديد</h2>
            <p className="text-muted-foreground">
              هذا القسم مخصص للمسؤولين لإضافة وإدارة المنتجات في المتجر.
            </p>
            <Button variant="hero" className="mt-4">
              <Plus className="h-5 w-5" />
              إضافة منتج
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
