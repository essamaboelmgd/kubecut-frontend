import { useState, useEffect } from 'react';
import {
  Megaphone,
  Plus,
  Trash2,
  ExternalLink,
  Power,
  PowerOff,
  Image as ImageIcon,
  Loader2,
  Check,
  LayoutDashboard,
  ShoppingBag,
  Monitor,
  Pencil
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { adsApi, type Ad, marketplaceApi, API_URL } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export default function Ads() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    link_url: string;
    locations: string[];
    image_url: string;
    priority: number;
  }>({
    title: '',
    link_url: '',
    locations: [],
    image_url: '',
    priority: 1
  });

  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchAds = async () => {
    try {
      const data = await adsApi.getAllAdsAdmin();
      setAds(data);
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل تحميل الإعلانات',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role !== 'admin') {
        navigate('/dashboard');
        return;
    }
    fetchAds();
  }, [user]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'خطأ',
        description: 'حجم الصورة يجب أن لا يتعدى 10 ميجابايت',
        variant: 'destructive',
      });
      return;
    }

    setUploadingImage(true);
    try {
      const { url } = await marketplaceApi.uploadImage(file);
      setFormData(prev => ({ ...prev, image_url: url }));
      toast({
        title: 'تم الرفع',
        description: 'تم رفع الصورة بنجاح',
      });
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل رفع الصورة',
        variant: 'destructive',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleOpenCreate = () => {
      setEditId(null);
      setFormData({
        title: '',
        link_url: '',
        locations: [],
        image_url: '',
        priority: 1
      });
      setIsDialogOpen(true);
  };

  const handleEdit = (ad: Ad) => {
      setEditId(ad.ad_id);
      setFormData({
          title: ad.title,
          link_url: ad.link_url || '',
          locations: ad.locations || [],
          image_url: ad.image_url,
          priority: ad.priority
      });
      setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.image_url || formData.locations.length === 0) {
      toast({
        title: 'تنبيه',
        description: 'يرجى ملء البيانات المطلوبة (العنوان، الصورة، ومكان واحد على الأقل)',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (editId) {
          const updatedAd = await adsApi.updateAd(editId, formData);
          setAds(ads.map(ad => ad.ad_id === editId ? updatedAd : ad));
          toast({
            title: 'تم التحديث',
            description: 'تم تحديث الإعلان بنجاح',
          });
      } else {
          const newAd = await adsApi.createAd(formData);
          setAds([newAd, ...ads]);
          toast({
            title: 'تم بنجاح',
            description: 'تم إنشاء الإعلان الجديد',
          });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: 'خطأ',
        description: editId ? 'فشل تحديث الإعلان' : 'فشل إنشاء الإعلان',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;
    try {
      await adsApi.deleteAd(id);
      setAds(ads.filter(ad => ad.ad_id !== id));
      toast({
        title: 'تم الحذف',
        description: 'تم حذف الإعلان بنجاح',
      });
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل حذف الإعلان',
        variant: 'destructive',
      });
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const updatedAd = await adsApi.toggleAd(id);
      setAds(ads.map(ad => ad.ad_id === id ? updatedAd : ad));
      toast({
        title: updatedAd.is_active ? 'تم التفعيل' : 'تم الإيقاف',
        description: `تم تحديث حالة الإعلان`,
      });
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل تحديث الحالة',
        variant: 'destructive',
      });
    }
  };

  const handleLocationChange = (loc: string, checked: boolean) => {
      setFormData(prev => {
          if (checked) {
              return { ...prev, locations: [...prev.locations, loc] };
          } else {
              return { ...prev, locations: prev.locations.filter(l => l !== loc) };
          }
      });
  };

  const getLocationLabel = (loc: string) => {
      switch(loc) {
          case 'dashboard_banner': return 'لوحة التحكم';
          case 'store_grid': return 'المتجر';
          case 'landing_page': return 'الرئيسية';
          default: return loc;
      }
  };

  const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${API_URL}${path}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">إدارة الإعلانات</h1>
          <p className="mt-1 text-muted-foreground">
             التحكم في البانرات والإعلانات المعروضة في المنصة
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          إعلان جديد
        </Button>
      </div>

      <div className="glass-card overflow-hidden ring-1 ring-white/10">
          <Table>
            <TableHeader className="bg-muted/40 text-xs uppercase tracking-wider">
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="py-4 px-6 text-right font-bold text-muted-foreground">الإعلان</TableHead>
                <TableHead className="py-4 px-6 text-right font-bold text-muted-foreground">أماكن العرض</TableHead>
                <TableHead className="py-4 px-6 text-right font-bold text-muted-foreground">الرابط</TableHead>
                <TableHead className="py-4 px-6 text-right font-bold text-muted-foreground">الحالة</TableHead>
                <TableHead className="py-4 px-6 text-left font-bold text-muted-foreground">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border/30 font-medium">
                {ads.map((ad) => (
                  <TableRow key={ad.ad_id} className="hover:bg-primary/5 transition-colors border-border/30">
                    <TableCell className="py-4 px-6">
                        <div className="flex items-center gap-3">
                            <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted/20 border border-white/10 shrink-0">
                                <img 
                                    src={getImageUrl(ad.image_url)} 
                                    alt={ad.title} 
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="font-semibold">{ad.title}</div>
                        </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                         <div className="flex flex-wrap gap-1">
                             {ad.locations && ad.locations.map(loc => (
                                 <Badge key={loc} variant="outline" className="bg-primary/5 text-[10px]">
                                     {getLocationLabel(loc)}
                                 </Badge>
                             ))}
                             {(!ad.locations || ad.locations.length === 0) && (
                                 <span className="text-muted-foreground text-xs">-</span>
                             )}
                         </div>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-xs text-muted-foreground max-w-[200px] truncate">
                        {ad.link_url || '-'}
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <Badge variant={ad.is_active ? 'default' : 'secondary'} className={ad.is_active ? 'bg-green-500 hover:bg-green-600' : ''}>
                        {ad.is_active ? 'نشط' : 'متوقف'}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-left">
                        <div className="flex justify-end gap-2">
                             <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleEdit(ad)}
                                className="text-primary hover:bg-primary/10 hover:text-primary"
                                title="تعديل"
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleToggle(ad.ad_id)}
                                title={ad.is_active ? "إيقاف" : "تفعيل"}
                            >
                                {ad.is_active ? <Power className="h-4 w-4 text-green-500" /> : <PowerOff className="h-4 w-4 text-muted-foreground" />}
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDelete(ad.ad_id)}
                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
         </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
           <DialogHeader>
                <DialogTitle>{editId ? 'تعديل الإعلان' : 'إضافة إعلان جديد'}</DialogTitle>
           </DialogHeader>
           <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label>العنوان</Label>
                    <Input 
                        placeholder="عنوان للإعلان (مثلاً: خصم الجمعة)" 
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                </div>

                <div className="grid gap-2">
                    <Label className="mb-2 block">أماكن العرض</Label>
                    <div className="grid gap-3 border p-4 rounded-lg bg-muted/20">
                        <div className="flex items-center gap-2">
                            <Checkbox 
                                id="chk_dashboard" 
                                checked={formData.locations.includes('dashboard_banner')}
                                onCheckedChange={(checked) => handleLocationChange('dashboard_banner', checked as boolean)}
                            />
                            <Label htmlFor="chk_dashboard" className="cursor-pointer font-normal">لوحة التحكم (بانر علوي)</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox 
                                id="chk_store" 
                                checked={formData.locations.includes('store_grid')}
                                onCheckedChange={(checked) => handleLocationChange('store_grid', checked as boolean)}
                            />
                            <Label htmlFor="chk_store" className="cursor-pointer font-normal">المتجر (وسط المنتجات)</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox 
                                id="chk_landing" 
                                checked={formData.locations.includes('landing_page')}
                                onCheckedChange={(checked) => handleLocationChange('landing_page', checked as boolean)}
                            />
                            <Label htmlFor="chk_landing" className="cursor-pointer font-normal">الصفحة الرئيسية (الموقع التعريفي)</Label>
                        </div>
                    </div>
                </div>
                
                <div className="grid gap-2">
                    <Label>الصورة</Label>
                    {formData.image_url && (
                        <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
                             <img src={getImageUrl(formData.image_url)} alt="Preview" className="w-full h-full object-cover" />
                             <Button 
                                variant="destructive" 
                                size="icon" 
                                className="absolute top-2 right-2 h-6 w-6"
                                onClick={() => setFormData({...formData, image_url: ''})}
                             >
                                 <Trash2 className="h-3 w-3" />
                             </Button>
                        </div>
                    )}
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <Input 
                                type="file" 
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploadingImage}
                            />
                        </div>
                        {uploadingImage && <Loader2 className="h-4 w-4 animate-spin" />}
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label>رابط التوجيه (اختياري)</Label>
                    <Input 
                        placeholder="https://example.com"
                        value={formData.link_url}
                        onChange={(e) => setFormData({...formData, link_url: e.target.value})}
                        dir="ltr"
                    />
                </div>
           </div>
           
           <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
                <Button onClick={handleSubmit} disabled={isSubmitting || uploadingImage}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (editId ? <Check className="mr-2 h-4 w-4" /> : <Megaphone className="mr-2 h-4 w-4" />)}
                    {editId ? 'حفظ التعديلات' : 'إنشاء الإعلان'}
                </Button>
           </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
