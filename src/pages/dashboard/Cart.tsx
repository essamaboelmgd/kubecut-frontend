import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <ShoppingCart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">سلة التسوق فارغة</h2>
          <p className="mb-6 text-muted-foreground">
            لم تقم بإضافة أي منتجات بعد
          </p>
          <Button variant="hero" onClick={() => navigate('/dashboard/store')}>
            <Package className="h-4 w-4" />
            تصفح المتجر
          </Button>
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
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">سلة التسوق</h1>
          <p className="mt-1 text-muted-foreground">
            {items.length} منتج في السلة
          </p>
        </div>
        <Button
          variant="outline"
          className="text-destructive hover:bg-destructive/10"
          onClick={clearCart}
        >
          <Trash2 className="h-4 w-4" />
          إفراغ السلة
        </Button>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={item.product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
            >
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {item.product.description}
                </p>
                <p className="mt-1 text-lg font-bold text-primary">
                  {item.product.price} ج.م
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => removeFromCart(item.product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:sticky lg:top-4 h-fit"
        >
          <div className="glass-card p-6">
            <h3 className="mb-4 text-lg font-semibold">ملخص الطلب</h3>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span>{item.product.price * item.quantity} ج.م</span>
                </div>
              ))}
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">المجموع الفرعي</span>
                  <span className="font-medium">{getCartTotal()} ج.م</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">الشحن</span>
                  <span className="text-sm text-muted-foreground">يحسب عند الدفع</span>
                </div>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">الإجمالي</span>
                  <span className="text-xl font-bold text-primary">
                    {getCartTotal()} ج.م
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="hero"
              className="mt-6 w-full"
              onClick={() => navigate('/dashboard/checkout')}
            >
              <ArrowLeft className="h-4 w-4" />
              إتمام الشراء
            </Button>
            <Button
              variant="outline"
              className="mt-2 w-full"
              onClick={() => navigate('/dashboard/store')}
            >
              متابعة التسوق
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
