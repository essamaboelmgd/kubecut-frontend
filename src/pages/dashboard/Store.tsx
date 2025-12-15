import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  ShoppingCart,
  Filter,
  Plus,
  ShoppingBag,
  Loader2,
  Image as ImageIcon,
  Upload,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '../../contexts/CartContext';
import { marketplaceApi, MarketplaceItem, MarketplaceItemCreate, API_URL } from '../../lib/api';

const statusLabels: Record<string, string> = {
  all: 'الكل',
  available: 'متاح',
  sold: 'مباع',
  reserved: 'محجوز',
};

const ProductCard = ({ 
  item, 
  onAddToCart, 
  getImageUrl, 
  statusLabels 
}: { 
  item: MarketplaceItem; 
  onAddToCart: (item: MarketplaceItem) => void;
  getImageUrl: (path: string) => string;
  statusLabels: Record<string, string>;
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasMultipleImages = item.images && item.images.length > 1;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.images) {
      setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.images) {
      setCurrentImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length);
    }
  };

  const isAvailable = item.status === 'available' && item.quantity > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="glass-card overflow-hidden group border-white/5 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="aspect-square overflow-hidden bg-muted/20 relative group-hover:bg-muted/30 transition-colors">
        {item.images && item.images.length > 0 ? (
          <motion.img
            key={currentImageIndex}
            src={getImageUrl(item.images[currentImageIndex])}
            alt={item.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground/30">
            <ImageIcon className="h-16 w-16" />
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Carousel Controls */}
        {hasMultipleImages && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/20 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-background/40"
              onClick={prevImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/20 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-background/40"
              onClick={nextImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {item.images.map((_, idx) => (
                <div 
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-4 bg-primary' : 'w-1.5 bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Status Overlays */}
        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-[2px] z-10">
            <div className={`px-4 py-1.5 rounded-full border shadow-lg font-bold text-sm ${
                item.status !== 'available' 
                ? 'bg-destructive/10 text-destructive border-destructive/20' 
                : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
            }`}>
              {item.status !== 'available' ? statusLabels[item.status] : 'نفذت الكمية'}
            </div>
          </div>
        )}
        
        {/* Unit Badge */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
            <span className="bg-background/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-medium border border-white/10 shadow-sm">
                {item.unit}
            </span>
             {item.quantity <= 5 && item.quantity > 0 && (
                <span className="bg-orange-500/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-sm animate-pulse">
                    متبقى {item.quantity}
                </span>
            )}
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div>
            <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">{item.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1 min-h-[2.5rem]">
            {item.description || 'لا يوجد وصف للمنتج'}
            </p>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">السعر</span>
            <span className="text-xl font-bold font-mono text-primary">{item.price} <span className="text-xs text-muted-foreground font-sans font-normal">ج.م</span></span>
          </div>
          <Button 
            size="sm" 
            onClick={() => onAddToCart(item)}
            disabled={!isAvailable}
            className={`rounded-xl px-4 transition-all duration-300 ${!isAvailable ? "opacity-50 cursor-not-allowed bg-muted text-muted-foreground" : "hover:scale-105 shadow-md shadow-primary/20"}`}
            variant={isAvailable ? "default" : "secondary"}
          >
            {!isAvailable ? (
                <>
                  <X className="h-4 w-4 ml-1" />
                  غير متاح
                </>
            ) : (
                <>
                  <Plus className="h-4 w-4 ml-1" />
                  إضافة
                </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default function Store() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart, getCartCount, getCartTotal } = useCart();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [newProduct, setNewProduct] = useState<MarketplaceItemCreate>({
    title: '',
    description: '',
    price: 0,
    quantity: 1,
    unit: 'قطعة',
    images: [],
    location: '',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchItems();
    }, 500); // Debounce search
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await marketplaceApi.getAll(search, statusFilter);
      setItems(data);
    } catch (error) {
      console.error(error);
      toast({
        title: 'خطأ',
        description: 'فشل تحميل المنتجات',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${API_URL}${path}`;
  };

  // No client-side filtering needed anymore
  const filteredItems = items;

  const handleAddToCart = (item: MarketplaceItem) => {
    addToCart(item);
    toast({
      title: 'تمت الإضافة',
      description: `تم إضافة "${item.title}" إلى السلة`,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    setIsUploading(true);
    const files = Array.from(e.target.files);
    
    try {
      const uploadPromises = files.map(file => marketplaceApi.uploadImage(file));
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map(r => r.url);
      
      setNewProduct(prev => ({
        ...prev,
        images: [...(prev.images || []), ...newUrls]
      }));
      
      toast({
        title: 'تم الرفع',
        description: 'تم رفع الصور بنجاح',
      });
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل رفع الصور',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const removeImage = (indexToRemove: number) => {
    setNewProduct(prev => ({
      ...prev,
      images: prev.images?.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleAddProduct = async () => {
    try {
      setIsAdding(true);
      
      await marketplaceApi.create(newProduct);
      
      toast({
        title: 'تم بنجاح',
        description: 'تم إضافة المنتج بنجاح',
      });
      
      setIsDialogOpen(false);
      setNewProduct({
        title: '',
        description: '',
        price: 0,
        quantity: 1,
        unit: 'قطعة',
        images: [],
        location: '',
      });
      fetchItems();
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل إضافة المنتج',
        variant: 'destructive',
      });
    } finally {
      setIsAdding(false);
    }
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-12 w-full sm:w-48">
                <Filter className="ml-2 h-4 w-4" />
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(statusLabels).map(([value, label]) => (
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
            {filteredItems.map((item) => (
              <ProductCard
                key={item.item_id}
                item={item}
                onAddToCart={handleAddToCart}
                getImageUrl={getImageUrl}
                statusLabels={statusLabels}
              />
            ))}
          </motion.div>

          {filteredItems.length === 0 && (
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
            <h2 className="mb-4 text-lg font-semibold">إدارة المنتجات</h2>
            <p className="text-muted-foreground mb-6">
              يمكنك إضافة منتجات جديدة لعرضها في المتجر.
            </p>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="hero">
                  <Plus className="h-5 w-5 ml-2" />
                  إضافة منتج جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>إضافة منتج جديد</DialogTitle>
                  <DialogDescription>
                    أدخل تفاصيل المنتج الجديد لإضافته للمتجر
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">
                  <div className="grid gap-2">
                    <Label htmlFor="title">اسم المنتج</Label>
                    <Input
                      id="title"
                      value={newProduct.title}
                      onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                      placeholder="مثال: لوح كونتر أرو"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">الوصف</Label>
                    <Textarea
                      id="description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      placeholder="وصف تفصيلي للمنتج..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="price">السعر (ج.م)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="quantity">الكمية المتاحة</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={newProduct.quantity}
                        onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="unit">الوحدة</Label>
                      <Input
                        id="unit"
                        value={newProduct.unit}
                        onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                        placeholder="مثال: قطعة، متر، لوح"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="location">الموقع (اختياري)</Label>
                      <Input
                        id="location"
                        value={newProduct.location}
                        onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })}
                        placeholder="المخزن الرئيسي"
                      />
                    </div>
                  </div>
                  
                  {/* Image Upload Section */}
                  <div className="grid gap-2">
                    <Label>صور المنتج</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {newProduct.images?.map((url, index) => (
                        <div key={index} className="relative aspect-square overflow-hidden rounded-md border border-border">
                          <img 
                            src={getImageUrl(url)} 
                            alt={`Preview ${index}`} 
                            className="h-full w-full object-cover"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 rounded-full bg-destructive p-0.5 text-white hover:bg-destructive/90"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      <div className="relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-muted-foreground/50 transition-colors hover:bg-muted/50">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="absolute inset-0 cursor-pointer opacity-0"
                          onChange={handleImageUpload}
                          disabled={isUploading}
                        />
                         {isUploading ? (
                          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        ) : (
                          <>
                            <Upload className="mb-1 h-6 w-6 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">رفع صور</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={handleAddProduct} disabled={isAdding || !newProduct.title || !newProduct.price}>
                    {isAdding && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                    إضافة المنتج
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
