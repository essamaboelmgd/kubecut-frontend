import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  ShoppingCart,
  Filter,
  Plus,
  ShoppingBag,
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '../../contexts/CartContext';
import { marketplaceApi, MarketplaceItem, API_URL, adsApi, Ad } from '../../lib/api';
import { SponsoredCard } from '@/components/ads/SponsoredCard';
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pencil,
  Trash2,
  Upload,
  Loader2
} from 'lucide-react';
import { MarketplaceItemCreate } from '../../lib/api';
import { trackPixelEvent } from '@/lib/pixel';

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
  statusLabels,
  isAdmin,
  onEdit,
  onDelete
}: {
  item: MarketplaceItem;
  onAddToCart: (item: MarketplaceItem) => void;
  getImageUrl: (path: string) => string;
  statusLabels: Record<string, string>;
  isAdmin?: boolean;
  onEdit?: (item: MarketplaceItem) => void;
  onDelete?: (item: MarketplaceItem) => void;
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
      className="glass-card overflow-hidden group border-white/5 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 relative"
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
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/20 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-background/40 z-20"
              onClick={prevImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/20 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-background/40 z-20"
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
            <div className={`px-4 py-1.5 rounded-full border shadow-lg font-bold text-sm ${item.status !== 'available'
              ? 'bg-destructive/10 text-destructive border-destructive/20'
              : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
              }`}>
              {item.status !== 'available' ? statusLabels[item.status] : 'نفذت الكمية'}
            </div>
          </div>
        )}

        {/* Unit Badge */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 z-20">
          <span className="bg-background/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-medium border border-white/10 shadow-sm">
            {item.unit}
          </span>
          {item.quantity <= 5 && item.quantity > 0 && (
            <span className="bg-orange-500/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-sm animate-pulse">
              متبقى {item.quantity}
            </span>
          )}
        </div>

        {/* Admin Controls overlay on top left */}
        {isAdmin && (
          <div className="absolute top-2 left-2 flex gap-1 z-30">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-white/90 shadow-sm hover:bg-white text-foreground"
              onClick={(e) => { e.stopPropagation(); onEdit?.(item); }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8 rounded-full shadow-sm"
              onClick={(e) => { e.stopPropagation(); onDelete?.(item); }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
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
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item);
            }}
            className={`rounded-xl px-4 transition-all duration-300 hover:scale-105 shadow-md shadow-primary/20`}
            variant="default"
          >
            تفاصيل / شراء
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
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Management State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingItem, setEditingItem] = useState<MarketplaceItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<MarketplaceItem | null>(null);

  const [formData, setFormData] = useState<MarketplaceItemCreate>({
    title: '',
    description: '',
    price: 0,
    quantity: 1,
    unit: 'قطعة',
    images: [],
    location: '',
  });

  const handleEditClick = (item: MarketplaceItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      price: item.price,
      quantity: item.quantity,
      unit: item.unit,
      images: item.images || [],
      location: item.location || '',
    });
    setIsEditOpen(true);
  };

  const handleDeleteClick = (item: MarketplaceItem) => {
    setItemToDelete(item);
    setIsDeleteOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    setIsUploading(true);
    const files = Array.from(e.target.files);

    // Validate file size (20MB)
    const validFiles = files.filter(file => {
      const isValidSize = file.size <= 20 * 1024 * 1024; // 20MB
      /* if (!isValidSize) {
        toast({
          title: 'حجم الملف كبير',
          description: `الصورة ${file.name} أكبر من 20 ميجابايت`,
          variant: 'destructive',
        });
      } */
      return isValidSize;
    });

    if (validFiles.length === 0) {
      setIsUploading(false);
      e.target.value = '';
      return;
    }

    try {
      const uploadPromises = validFiles.map(file => marketplaceApi.uploadImage(file));
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map(r => r.url);

      setFormData(prev => ({
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
      e.target.value = '';
    }
  };

  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    try {
      setIsSubmitting(true);
      await marketplaceApi.update(editingItem.item_id, formData);
      toast({ title: 'تم التحديث', description: 'تم تحديث بيانات المنتج بنجاح' });
      setIsEditOpen(false);
      fetchItems();
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل تحديث المنتج',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      await marketplaceApi.deleteItem(itemToDelete.item_id);
      toast({ title: 'تم الحذف', description: 'تم حذف المنتج بنجاح' });
      fetchItems();
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل حذف المنتج',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteOpen(false);
      setItemToDelete(null);
    }
  };

  useEffect(() => {
    trackPixelEvent('ViewContent');
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchItems();
    }, 500); // Debounce search
    return () => clearTimeout(timer);
  }, [search, statusFilter, currentPage]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const [data, adsData] = await Promise.all([
        marketplaceApi.getAll(search, statusFilter, currentPage),
        adsApi.getAds('store_grid')
      ]);
      setItems(data.items);
      setTotalPages(data.total_pages);
      setAds(adsData);
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
    if (!user) {
      toast({
        title: 'تسجيل الدخول مطلوب',
        description: 'يجب تسجيل الدخول لعرض تفاصيل المنتج',
      });
      navigate('/login', { state: { from: { pathname: `/dashboard/store/${item.item_id}` } } });
      return;
    }
    navigate(`/dashboard/store/${item.item_id}`);
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
            onChange={(e) => handleSearchChange(e.target.value)}
            className="h-12 pr-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={handleStatusChange}>
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
        {filteredItems.map((item, index) => (
          <React.Fragment key={item.item_id}>
            <ProductCard
              item={item}
              onAddToCart={handleAddToCart}
              getImageUrl={getImageUrl}
              statusLabels={statusLabels}
              isAdmin={isAdmin}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
            {/* Insert Ad every 6 items */}
            {(index + 1) % 6 === 0 && ads.length > 0 && (
              <SponsoredCard ad={ads[Math.floor((index + 1) / 6) % ads.length]} />
            )}
          </React.Fragment>
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 pb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || loading}
            className="h-10 w-10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                onClick={() => setCurrentPage(page)}
                disabled={loading}
                className={`h-10 w-10 ${currentPage === page ? 'bg-primary text-primary-foreground' : ''}`}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || loading}
            className="h-10 w-10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تعديل المنتج</DialogTitle>
            <DialogDescription>
              تعديل بيانات المنتج المعروض
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">اسم المنتج</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="مثال: لوح كونتر أرو"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">الوصف</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="وصف تفصيلي للمنتج..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">السعر (ج.م)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quantity">الكمية المتاحة</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="unit">الوحدة</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="مثال: قطعة، متر، لوح"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">الموقع (اختياري)</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="المخزن الرئيسي"
                />
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="grid gap-2">
              <Label className="flex items-center gap-1">
                صور المنتج
                <span className="text-destructive">*</span>
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {formData.images?.map((url, index) => (
                  <div key={index} className="relative aspect-square overflow-hidden rounded-md border border-border group">
                    <img
                      src={getImageUrl(url)}
                      alt={`Preview ${index}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 rounded-full bg-destructive p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
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
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>إلغاء</Button>
            <Button onClick={handleSaveEdit} disabled={isSubmitting || !formData.title || !formData.price || !formData.images?.length}>
              {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              حفظ التعديلات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف المنتج "{itemToDelete?.title}" نهائياً من المتجر. لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              نعم، احذف المنتج
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
