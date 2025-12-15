import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Truck,
  CheckCircle,
  ArrowRight,
  Wallet,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { API_URL } from '@/lib/api';

const paymentMethods = [
  { id: 'cash', label: 'الدفع عند الاستلام', icon: Wallet },
  { id: 'card', label: 'بطاقة ائتمان', icon: CreditCard },
  { id: 'bank', label: 'تحويل بنكي', icon: Building2 },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, getCartTotal, placeOrder } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('cash');

  const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${API_URL}${path}`;
  };

  if (items.length === 0 && !orderComplete) {
    navigate('/dashboard/cart');
    return null;
  }

  const handleSubmitOrder = async () => {
    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول المطلوبة',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    try {
      const fullAddress = `${shippingInfo.address}, ${shippingInfo.city}${shippingInfo.notes ? ` (${shippingInfo.notes})` : ''}`;
      const order = await placeOrder(fullAddress, paymentMethod);
      setOrderId(order.id);
      setOrderComplete(true);
      toast({
        title: 'تم الطلب بنجاح',
        description: `رقم الطلب: ${order.id}`,
      });
    } catch {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إتمام الطلب',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"
          >
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </motion.div>
          <h2 className="mb-2 text-2xl font-bold">تم إتمام الطلب بنجاح!</h2>
          <p className="mb-2 text-muted-foreground">
            شكراً لك على طلبك
          </p>
          <p className="mb-6 text-lg font-medium text-primary">
            رقم الطلب: {orderId}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button variant="hero" onClick={() => navigate('/dashboard/orders')}>
              عرض الطلبات
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard/store')}>
              متابعة التسوق
            </Button>
          </div>
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
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/dashboard/cart')}
        >
          <ArrowRight className="h-4 w-4" />
          العودة للسلة
        </Button>
        <h1 className="text-2xl font-bold md:text-3xl">إتمام الشراء</h1>
      </motion.div>

      {/* Steps Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-center max-w-2xl mx-auto mb-10"
      >
        <div className="relative flex Items-center justify-between w-full">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted -z-10 -translate-y-1/2" />
            
            {/* Step 1 */}
            <div className={`relative flex flex-col items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 z-10 bg-background ${
                    step >= 1 ? 'border-primary shadow-lg shadow-primary/20 scale-110' : 'border-muted'
                }`}>
                    <Truck className="h-5 w-5" />
                    {step === 1 && <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />}
                </div>
                <span className="text-sm font-bold">الشحن</span>
            </div>

             {/* Line 1 */}
            <div className={`flex-1 h-0.5 mx-2 transition-colors duration-500 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />

            {/* Step 2 */}
             <div className={`relative flex flex-col items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 z-10 bg-background ${
                    step >= 2 ? 'border-primary shadow-lg shadow-primary/20 scale-110' : 'border-muted'
                }`}>
                    <CreditCard className="h-5 w-5" />
                     {step === 2 && <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />}
                </div>
                <span className="text-sm font-bold">الدفع</span>
            </div>

             {/* Line 2 */}
            <div className={`flex-1 h-0.5 mx-2 transition-colors duration-500 ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />

             {/* Step 3 */}
            <div className={`relative flex flex-col items-center gap-2 ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 z-10 bg-background ${
                    step >= 3 ? 'border-primary shadow-lg shadow-primary/20 scale-110' : 'border-muted'
                }`}>
                    <CheckCircle className="h-5 w-5" />
                </div>
                <span className="text-sm font-bold">التأكيد</span>
            </div>
        </div>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Step 1: Shipping */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-8 border-primary/10"
            >
              <div className="mb-8 flex items-center gap-3 border-b border-border/50 pb-4">
                 <div className="p-2.5 bg-primary/10 rounded-xl text-primary ring-1 ring-primary/20">
                    <Truck className="h-6 w-6" />
                 </div>
                 <div>
                    <h2 className="text-lg font-bold">معلومات الشحن</h2>
                    <p className="text-sm text-muted-foreground">أدخل تفاصيل التوصيل الخاصة بك</p>
                 </div>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">الاسم الكامل *</Label>
                   <div className="relative group">
                    <Input
                        id="name"
                        value={shippingInfo.name}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                        className="h-12 bg-background/50 focus:bg-background transition-colors"
                        placeholder="أدخل اسمك الكامل"
                    />
                   </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">رقم الهاتف *</Label>
                   <div className="relative group">
                    <Input
                        id="phone"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                        className="h-12 bg-background/50 focus:bg-background transition-colors font-mono"
                        placeholder="01xxxxxxxxx"
                        dir="ltr"
                    />
                   </div>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address" className="text-sm font-medium">العنوان التفصيلي *</Label>
                   <div className="relative group">
                    <Input
                        id="address"
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                        className="h-12 bg-background/50 focus:bg-background transition-colors"
                        placeholder="الشارع، المنطقة، المبنى"
                    />
                   </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium">المدينة *</Label>
                   <div className="relative group">
                    <Input
                        id="city"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        className="h-12 bg-background/50 focus:bg-background transition-colors"
                        placeholder="القاهرة"
                    />
                   </div>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="notes" className="text-sm font-medium">ملاحظات إضافية</Label>
                   <div className="relative group">
                    <Textarea
                        id="notes"
                        value={shippingInfo.notes}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, notes: e.target.value })}
                        className="bg-background/50 focus:bg-background transition-colors resize-none"
                        placeholder="تعليمات خاصة للتوصيل..."
                        rows={4}
                    />
                   </div>
                </div>
              </div>
              <Button
                variant="hero"
                className="mt-8 w-full sm:w-auto min-w-[150px]"
                onClick={() => setStep(2)}
              >
                متابعة للدفع
                <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
              </Button>
            </motion.div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6"
            >
              <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">
                <CreditCard className="h-5 w-5 text-primary" />
                طريقة الدفع
              </h2>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors ${
                        paymentMethod === method.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <RadioGroupItem value={method.id} />
                      <method.icon className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{method.label}</span>
                    </label>
                  ))}
                </div>
              </RadioGroup>
              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)}>
                  رجوع
                </Button>
                <Button variant="hero" onClick={() => setStep(3)}>
                  متابعة للتأكيد
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6"
            >
              <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">
                <CheckCircle className="h-5 w-5 text-primary" />
                تأكيد الطلب
              </h2>
              <div className="space-y-4">
                <div className="rounded-lg border border-border p-4">
                  <h3 className="mb-2 font-medium">معلومات الشحن</h3>
                  <p className="text-sm text-muted-foreground">{shippingInfo.name}</p>
                  <p className="text-sm text-muted-foreground">{shippingInfo.phone}</p>
                  <p className="text-sm text-muted-foreground">
                    {shippingInfo.address}, {shippingInfo.city}
                  </p>
                  {shippingInfo.notes && (
                    <p className="text-sm text-muted-foreground">ملاحظات: {shippingInfo.notes}</p>
                  )}
                </div>
                <div className="rounded-lg border border-border p-4">
                  <h3 className="mb-2 font-medium">طريقة الدفع</h3>
                  <p className="text-sm text-muted-foreground">
                    {paymentMethods.find((m) => m.id === paymentMethod)?.label}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)}>
                  رجوع
                </Button>
                <Button
                  variant="hero"
                  onClick={handleSubmitOrder}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'جاري المعالجة...' : 'تأكيد الطلب'}
                </Button>
              </div>
            </motion.div>
          )}
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
                <div key={item.product.item_id} className="flex items-center gap-3">
                  <div className="h-12 w-12 overflow-hidden rounded-lg bg-muted">
                    <img
                      src={getImageUrl(item.product.images[0])}
                      alt={item.product.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-1">{item.product.title}</p>
                    <p className="text-xs text-muted-foreground">الكمية: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium">
                    {item.product.price * item.quantity} ج.م
                  </span>
                </div>
              ))}
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">المجموع الفرعي</span>
                  <span>{getCartTotal()} ج.م</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">الشحن</span>
                  <span className="text-green-600">مجاني</span>
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
          </div>
        </motion.div>
      </div>
    </div>
  );
}
