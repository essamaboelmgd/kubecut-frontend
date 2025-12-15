import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { marketplaceApi, type MarketplaceItem, API_URL } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  pending: { label: 'قيد الانتظار', icon: Clock, color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30' },
  processing: { label: 'قيد المعالجة', icon: Truck, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
  completed: { label: 'مكتمل', icon: CheckCircle, color: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
  cancelled: { label: 'ملغي', icon: XCircle, color: 'text-red-600 bg-red-100 dark:bg-red-900/30' },
  // Mapping 'sold' to completed for now as it's the only final state in current backend
  sold: { label: 'تم الشراء', icon: CheckCircle, color: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
};

function OrderCard({ item }: { item: MarketplaceItem }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusKey = item.status === 'sold' ? 'sold' : 'pending'; 
  const status = statusConfig[statusKey] || statusConfig.pending;
  const StatusIcon = status.icon;

  const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${API_URL}${path}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      layout
      className="glass-card group overflow-hidden transition-all duration-300 hover:shadow-glow"
    >
      <div
        className="flex cursor-pointer items-center justify-between p-5"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-5">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${status.color.replace('bg-', 'bg-opacity-20 bg-')} ring-1 ring-inset ring-white/10 shadow-sm`}>
            <StatusIcon className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
                <p className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{item.title}</p>
                <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ring-white/10 ${status.color}`}>
                    {status.label}
                </span>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Clock className="h-3.5 w-3.5" />
                {formatDate(item.updated_at || item.created_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-left hidden sm:block">
            <p className="font-bold text-xl text-primary font-mono">{item.price} ج.م</p>
            <p className="text-xs text-muted-foreground font-medium">{item.quantity} {item.unit}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
            <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border/50 bg-muted/20"
            >
            <div className="p-5 space-y-6">
                {/* Order Items */}
                <div className="flex items-start gap-4">
                    <div className="h-20 w-20 overflow-hidden rounded-xl bg-muted shadow-sm shrink-0 ring-1 ring-border/50">
                    {item.images && item.images.length > 0 ? (
                        <img
                        src={getImageUrl(item.images[0])}
                        alt={item.title}
                        className="h-full w-full object-cover"
                        />
                    ) : (
                        <Package className="h-full w-full p-4 text-muted-foreground" />
                    )}
                    </div>
                    <div className="flex-1 space-y-1">
                        <p className="font-semibold text-base">{item.title}</p>
                        <p className="text-sm text-muted-foreground leading-snug max-w-lg">
                            {item.description}
                        </p>
                        <div className="flex items-center gap-3 pt-2 text-sm text-muted-foreground font-medium">
                            <span className="bg-background/80 px-2 py-1 rounded-md border border-border/50">
                                الكمية: {item.quantity}
                            </span>
                             <span className="bg-background/80 px-2 py-1 rounded-md border border-border/50">
                                سعر الوحدة: {item.price} ج.م
                            </span>
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 bg-background/40 p-4 rounded-xl border border-white/5">
                    <div>
                        <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">عنوان الشحن</h4>
                        <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-primary" />
                            <p className="text-sm font-medium">المكتب الرئيسي (افتراضي)</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">طريقة الدفع</h4>
                         <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full border-2 border-primary/60" />
                            <p className="text-sm font-medium">دفع عند الاستلام</p>
                        </div>
                    </div>
                     <div>
                        <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">رقم الطلب</h4>
                        <p className="text-sm font-mono text-muted-foreground">#{item.item_id.slice(-8).toUpperCase()}</p>
                    </div>
                </div>
            </div>
            </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState<MarketplaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await marketplaceApi.getMyOrders();
        setOrders(data);
      } catch (error) {
        toast({
          title: 'خطأ',
          description: 'فشل تحميل الطلبات',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">لا توجد طلبات</h2>
          <p className="text-muted-foreground">
            لم تقم بأي طلبات بعد
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold md:text-3xl">سجل الطلبات</h1>
        <p className="mt-1 text-muted-foreground">
          عرض جميع طلباتك السابقة من المتجر
        </p>
      </motion.div>

      <div className="space-y-4">
        {orders.map((item, index) => (
          <motion.div
            key={item.item_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <OrderCard item={item} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
