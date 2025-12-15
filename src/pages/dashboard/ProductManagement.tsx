import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  Loader2,
  Image as ImageIcon,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { useToast } from '@/hooks/use-toast';
import { marketplaceApi, MarketplaceItem, MarketplaceItemCreate, API_URL } from '../../lib/api';

const ProductCard = ({ 
  item, 
  onEdit, 
  onDelete, 
  getImageUrl 
}: { 
  item: MarketplaceItem; 
  onEdit: (item: MarketplaceItem) => void;
  onDelete: (item: MarketplaceItem) => void;
  getImageUrl: (path: string) => string;
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      className="glass-card overflow-hidden group border-white/5 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 flex flex-col h-full"
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
          </>
        )}

        {/* Status Badge */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
           <span className={`backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm ${
               item.status === 'available' ? 'bg-green-500/90 text-white' : 
               item.status === 'sold' ? 'bg-destructive/90 text-white' : 
               'bg-orange-500/90 text-white'
           }`}>
                {item.status === 'available' ? 'معروض للبيع' : 
                 item.status === 'sold' ? 'تم البيع' : 'محجوز'}
            </span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-2">
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg line-clamp-1">{item.title}</h3>
                <span className="text-xl font-bold font-mono text-primary">{item.price} <span className="text-xs text-muted-foreground font-sans font-normal">ج.م</span></span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1 min-h-[2.5rem]">
            {item.description || 'لا يوجد وصف للمنتج'}
            </p>
        </div>
        
        <div className="mt-auto pt-4 border-t border-white/5 grid grid-cols-2 gap-2">
            <Button 
                variant="outline" 
                size="sm"
                className="w-full gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary/20"
                onClick={() => onEdit(item)}
            >
                <Pencil className="h-4 w-4" />
                تعديل
            </Button>
            <Button 
                variant="outline" 
                size="sm"
                className="w-full gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
                onClick={() => onDelete(item)}
            >
                <Trash2 className="h-4 w-4" />
                حذف
            </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default function ProductManagement() {
  const { toast } = useToast();
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Dialog States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [editingItem, setEditingItem] = useState<MarketplaceItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<MarketplaceItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<MarketplaceItemCreate>({
    title: '',
    description: '',
    price: 0,
    quantity: 1,
    unit: 'قطعة',
    images: [],
    location: '',
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const data = await marketplaceApi.getMyListings();
      setItems(data);
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل تحميل منتجاتك',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${API_URL}${path}`;
  };

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase()) || 
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenCreate = () => {
      setEditingItem(null);
      setFormData({
        title: '',
        description: '',
        price: 0,
        quantity: 1,
        unit: 'قطعة',
        images: [],
        location: '',
      });
      setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: MarketplaceItem) => {
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
      setIsDialogOpen(true);
  };

  const handleOpenDelete = (item: MarketplaceItem) => {
      setItemToDelete(item);
      setIsDeleteDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    setIsUploading(true);
    const files = Array.from(e.target.files);
    
    try {
      const uploadPromises = files.map(file => marketplaceApi.uploadImage(file));
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

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      if (editingItem) {
          await marketplaceApi.update(editingItem.item_id, formData);
          toast({ title: 'تم التحديث', description: 'تم تحديث بيانات المنتج بنجاح' });
      } else {
          await marketplaceApi.create(formData);
          toast({ title: 'تم الإضافة', description: 'تم إضافة المنتج الجديد بنجاح' });
      }
      
      setIsDialogOpen(false);
      fetchItems();
    } catch (error) {
      toast({
        title: 'خطأ',
        description: editingItem ? 'فشل تحديث المنتج' : 'فشل إضافة المنتج',
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
          setIsDeleteDialogOpen(false);
          setItemToDelete(null);
      }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">إدارة منتجاتي</h1>
          <p className="mt-1 text-muted-foreground">
            إضافة وتعديل المنتجات المعروضة للبيع
          </p>
        </div>
        <Button variant="hero" onClick={handleOpenCreate}>
          <Plus className="ml-2 h-5 w-5" />
          منتج جديد
        </Button>
      </motion.div>

      {/* Search Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="relative max-w-md"
      >
        <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="ابحث في منتجاتك..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-12 pr-10"
        />
      </motion.div>

      {/* Items Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
                <ProductCard 
                    key={item.item_id} 
                    item={item} 
                    onEdit={handleOpenEdit} 
                    onDelete={handleOpenDelete}
                    getImageUrl={getImageUrl}
                />
            ))}
        </div>
      )}

      {!isLoading && filteredItems.length === 0 && (
        <div className="glass-card flex flex-col items-center justify-center py-16 text-center">
            <Package className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium mb-2">لا توجد منتجات</h3>
            <p className="text-muted-foreground mb-6">لم تقم بإضافة أي منتجات للعرض بعد</p>
            <Button variant="outline" onClick={handleOpenCreate}>ابدأ بإضافة منتج</Button>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'تعديل المنتج' : 'إضافة منتج جديد'}</DialogTitle>
              <DialogDescription>
                {editingItem ? 'تعديل بيانات المنتج الحالي' : 'أدخل بيانات المنتج الجديد لعرضه في المتجر'}
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
                <Label>صور المنتج</Label>
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
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSubmit} disabled={isSubmitting || !formData.title || !formData.price}>
                {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                {editingItem ? 'حفظ التعديلات' : 'إضافة المنتج'}
              </Button>
            </DialogFooter>
          </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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
