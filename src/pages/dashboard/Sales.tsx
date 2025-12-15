import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Package, Calendar, User, DollarSign, Check, X, Phone } from 'lucide-react';
import { marketplaceApi, MarketplaceItem, ItemStatus } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function Sales() {
  const [sales, setSales] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [contactDetails, setContactDetails] = useState<{name: string, phone: string, email: string} | null>(null);
  const [contactLoading, setContactLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const data = await marketplaceApi.getSales();
      setSales(data);
    } catch (error) {
      console.error(error);
      toast({
        title: 'خطأ',
        description: 'فشل تحميل المبيعات',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (itemId: string) => {
      try {
          setProcessingId(itemId);
          await marketplaceApi.acceptOrder(itemId);
          toast({ title: 'تم قبول الطلب', description: 'يمكنك الآن التواصل مع العميل' });
          fetchSales();
      } catch (error) {
          toast({ title: 'خطأ', description: 'فشل قبول الطلب', variant: 'destructive' });
      } finally {
          setProcessingId(null);
      }
  };

  const handleDeny = async (itemId: string) => {
      try {
          setProcessingId(itemId);
          await marketplaceApi.denyOrder(itemId);
          toast({ title: 'تم رفض الطلب', description: 'تم إعادة المنتج للمتجر' });
          fetchSales();
      } catch (error) {
          toast({ title: 'خطأ', description: 'فشل رفض الطلب', variant: 'destructive' });
      } finally {
          setProcessingId(null);
      }
  };
  
  const fetchContact = async (itemId: string) => {
      try {
          setContactLoading(true);
          const details = await marketplaceApi.getBuyerDetails(itemId);
          setContactDetails(details);
      } catch (error) {
           toast({ title: 'خطأ', description: 'فشل تحميل بيانات العميل', variant: 'destructive' });
      } finally {
          setContactLoading(false);
      }
  };

  const totalRevenue = sales.filter(s => s.status === ItemStatus.SOLD).reduce((acc, item) => acc + item.price, 0);
  const pendingCount = sales.filter(s => s.status === ItemStatus.PENDING).length;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2">المبيعات</h1>
        <p className="text-muted-foreground">تابع الطلبات الواردة من العملاء</p>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass-card p-6 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">إجمالي المبيعات المؤكدة</p>
                <div className="text-3xl font-bold tracking-tight text-primary font-mono">{totalRevenue} <span className="text-lg text-muted-foreground">ج.م</span></div>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <DollarSign className="h-6 w-6" />
            </div>
        </div>
       
        <div className="glass-card p-6 flex items-center justify-between">
            <div>
                 <p className="text-sm font-medium text-muted-foreground mb-1">طلبات في الانتظار</p>
                 <div className="text-3xl font-bold tracking-tight text-orange-500 font-mono">{pendingCount}</div>
            </div>
            <div className="h-12 w-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500">
                <Package className="h-6 w-6" />
            </div>
        </div>
      </div>

      {/* Sales List */}
      <div className="glass-card p-0 overflow-hidden">
        <div className="p-6 border-b border-border/50">
           <h2 className="text-lg font-bold">سجل الطلبات</h2>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-12">
                 <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : sales.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Package className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h3 className="font-semibold text-lg text-muted-foreground">لا توجد مبيعات حتى الان</h3>
            </div>
          ) : (
            <div className="space-y-4">
              {sales.map((item, index) => (
                <motion.div
                  key={item.item_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl border border-white/5 bg-background/40 hover:bg-muted/30 transition-all duration-300 hover:shadow-sm"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0 ring-1 ring-inset ring-white/10">
                      <Package className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{item.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={item.status === ItemStatus.PENDING ? "outline" : "default"} className={item.status === ItemStatus.PENDING ? "text-orange-500 border-orange-500 bg-orange-500/10" : ""}>
                            {item.status === ItemStatus.PENDING ? 'في الانتظار' : 'تم البيع'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">•</span>
                         <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{item.updated_at ? format(new Date(item.updated_at), 'PPP', { locale: ar }) : '-'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end mt-4 md:mt-0 pl-2">
                    <div className="text-left">
                        <p className="font-bold text-xl font-mono">{item.price} ج.م</p>
                    </div>

                    <div className="flex gap-2">
                        {item.status === ItemStatus.PENDING && (
                            <>
                                <Button 
                                    size="sm" 
                                    className="bg-green-600 hover:bg-green-700 text-white" 
                                    onClick={() => handleAccept(item.item_id)}
                                    disabled={processingId === item.item_id}
                                >
                                    <Check className="h-4 w-4 ml-1" />
                                    قبول
                                </Button>
                                <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-destructive hover:bg-destructive/10 border-destructive/20"
                                    onClick={() => handleDeny(item.item_id)}
                                    disabled={processingId === item.item_id}
                                >
                                    <X className="h-4 w-4 ml-1" />
                                    رفض
                                </Button>
                            </>
                        )}
                        {item.status === ItemStatus.SOLD && (
                             <Dialog>
                                <DialogTrigger asChild>
                                    <Button size="sm" variant="secondary" onClick={() => fetchContact(item.item_id)} className="hover:bg-primary/20 hover:text-primary">
                                        <Phone className="h-4 w-4 ml-2" />
                                        بيانات العميل
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="glass-card">
                                    <DialogHeader>
                                        <DialogTitle>بيانات التواصل مع العميل</DialogTitle>
                                    </DialogHeader>
                                    <div className="py-4 space-y-4">
                                        {contactLoading ? (
                                            <div className="flex justify-center p-4"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
                                        ) : contactDetails ? (
                                            <>
                                                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border/50">
                                                    <span className="text-muted-foreground flex items-center gap-2"><User className="h-4 w-4" /> الاسم</span>
                                                    <span className="font-bold">{contactDetails.name}</span>
                                                </div>
                                                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border/50">
                                                    <span className="text-muted-foreground flex items-center gap-2"><Phone className="h-4 w-4" /> الهاتف</span>
                                                    <a href={`tel:${contactDetails.phone}`} className="font-bold text-primary hover:underline font-mono" dir="ltr">{contactDetails.phone}</a>
                                                </div>
                                                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border/50">
                                                    <span className="text-muted-foreground flex items-center gap-2"><Package className="h-4 w-4" /> البريد</span>
                                                    <span className="font-bold font-mono">{contactDetails.email}</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center text-destructive">فشل تحميل البيانات</div>
                                        )}
                                    </div>
                                </DialogContent>
                             </Dialog>
                        )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
