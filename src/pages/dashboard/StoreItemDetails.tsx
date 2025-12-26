import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Phone,
  MessageCircle,
  MapPin,
  Share2,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { marketplaceApi, MarketplaceItem, API_URL } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function StoreItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [item, setItem] = useState<MarketplaceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        if (!id) return;
        const data = await marketplaceApi.getItem(id);
        setItem(data);
      } catch (error) {
        toast({
          title: 'خطأ',
          description: 'فشل تحميل تفاصيل المنتج',
          variant: 'destructive',
        });
        navigate('/dashboard/store');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, navigate, toast]);

  const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${API_URL}${path}`;
  };

  const nextImage = () => {
    if (item?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
    }
  };

  const prevImage = () => {
    if (item?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/store')}>
          <ArrowRight className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">تفاصيل المنتج</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-muted/20">
            {item.images && item.images.length > 0 ? (
              <motion.img
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={getImageUrl(item.images[currentImageIndex])}
                alt={item.title}
                className="h-full w-full object-cover"
              />
            ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                    لا توجد صور
                </div>
            )}

            {/* Navigation */}
            {item.images && item.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
                  onClick={prevImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
                  onClick={nextImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
          
          {/* Thumbnails */}
          {item.images && item.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {item.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                    idx === currentImageIndex ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={getImageUrl(img)} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between">
                <div>
                     <h2 className="text-3xl font-bold">{item.title}</h2>
                     <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{item.location || 'غير محدد'}</span>
                     </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-primary font-mono">{item.price} <span className="text-sm">ج.م</span></div>
                    <Badge variant={item.status === 'available' ? 'default' : 'destructive'} className="mt-1">
                        {item.status === 'available' ? 'متاح' : 'غير متاح'}
                    </Badge>
                </div>
            </div>
          </div>

          <div className="p-4 rounded-xl facebook-card border border-white/5 bg-secondary/5">
            <h3 className="font-semibold mb-2">الوصف</h3>
            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {item.description}
            </p>
          </div>

          <div className="space-y-3">
             <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card/50">
                 <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                     <User className="h-5 w-5" />
                 </div>
                 <div>
                     <div className="text-sm text-muted-foreground">البائع</div>
                     <div className="font-medium">{item.seller_name || 'غير معروف'}</div>
                 </div>
             </div>
          </div>

          <div className="grid gap-3 pt-4">
              {item.seller_phone ? (
                  <>
                    <a href={`tel:${item.seller_phone}`} className="w-full">
                        <Button className="w-full gap-2 h-12 text-lg" variant="default">
                            <Phone className="h-5 w-5" />
                            اتصال بالبائع
                        </Button>
                    </a>
                    <a href={`https://wa.me/2${item.seller_phone}`} target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button className="w-full gap-2 h-12 text-lg bg-[#25D366] hover:bg-[#128C7E] text-white border-none">
                            <MessageCircle className="h-5 w-5" />
                            تواصل واتساب
                        </Button>
                    </a>
                  </>
              ) : (
                  <Button disabled className="w-full gap-2" variant="secondary">
                       <Phone className="h-4 w-4" />
                       رقم الهاتف غير متاح
                  </Button>
              )}
          </div>

          {/* Disclaimer */}
          <div className="mt-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm">
             <div className="flex gap-2">
                 <AlertTriangle className="h-5 w-5 shrink-0" />
                 <p>
                    <strong>إخلاء مسؤولية:</strong> الموقع مجرد وسيط للعرض ولا يتحمل أي مسؤولية عن جودة المنتجات أو المعاملات المالية. يرجى معاينة المنتج جيداً قبل الشراء.
                 </p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
