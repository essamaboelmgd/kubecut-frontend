import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart, Order } from '@/contexts/CartContext';

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  pending: { label: 'قيد الانتظار', icon: Clock, color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30' },
  processing: { label: 'قيد المعالجة', icon: Truck, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
  completed: { label: 'مكتمل', icon: CheckCircle, color: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
  cancelled: { label: 'ملغي', icon: XCircle, color: 'text-red-600 bg-red-100 dark:bg-red-900/30' },
};

function OrderCard({ order }: { order: Order }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const status = statusConfig[order.status];
  const StatusIcon = status.icon;

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
      className="glass-card overflow-hidden"
    >
      <div
        className="flex cursor-pointer items-center justify-between p-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${status.color}`}>
            <StatusIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold">{order.id}</p>
            <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-left">
            <p className="font-bold text-primary">{order.total} ج.م</p>
            <p className="text-xs text-muted-foreground">{order.items.length} منتج</p>
          </div>
          <Button variant="ghost" size="icon">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-border"
        >
          <div className="p-4 space-y-4">
            {/* Order Items */}
            <div>
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">المنتجات</h4>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-lg bg-muted">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} × {item.product.price} ج.م
                      </p>
                    </div>
                    <span className="font-medium">
                      {item.product.price * item.quantity} ج.م
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Details */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="mb-1 text-sm font-medium text-muted-foreground">عنوان الشحن</h4>
                <p className="text-sm">{order.shippingAddress}</p>
              </div>
              <div>
                <h4 className="mb-1 text-sm font-medium text-muted-foreground">طريقة الدفع</h4>
                <p className="text-sm">
                  {order.paymentMethod === 'cash' && 'الدفع عند الاستلام'}
                  {order.paymentMethod === 'card' && 'بطاقة ائتمان'}
                  {order.paymentMethod === 'bank' && 'تحويل بنكي'}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm ${status.color}`}>
                <StatusIcon className="h-4 w-4" />
                {status.label}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function Orders() {
  const { orders } = useCart();

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
          عرض جميع طلباتك السابقة
        </p>
      </motion.div>

      <div className="space-y-4">
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <OrderCard order={order} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
