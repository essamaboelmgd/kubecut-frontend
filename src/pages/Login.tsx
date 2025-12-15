import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { authApi, LoginRequest, User, setToken } from '../lib/api';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || !password) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.login({
        phone,
        password,
        device_id: 'web-client', // or generate a UUID if needed, but static for now is okay for web
        device_name: navigator.userAgent
      });
      
      // Fetch real user data
      setToken(response.access_token); // Set token temporarily for the next request
      const userData = await authApi.me();
      
      login(response.access_token, userData);

      toast({
        title: 'مرحباً بك',
        description: 'تم تسجيل الدخول بنجاح',
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: error.message || 'رقم الهاتف أو كلمة المرور غير صحيحة',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-cairo">
      {/* Left Side - Form */}
      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-16">
        <div className="absolute left-4 top-4">
          <ThemeToggle />
        </div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="mb-8 flex items-center gap-2">
            <img src="/logo.png" alt="KubeCut Logo" className="h-10 w-10 object-contain" />
            <span className="text-xl font-bold">كيوب كت</span>
          </Link>

          <h1 className="mb-2 text-3xl font-bold">مرحباً بعودتك</h1>
          <p className="mb-8 text-muted-foreground">
            سجّل دخولك للوصول إلى لوحة التحكم
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="01xxxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-12"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pl-12"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" className="rounded border-input" />
                <span>تذكرني</span>
              </label>
              <a href="#" className="text-primary hover:underline">
                نسيت كلمة المرور؟
              </a>
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                'تسجيل الدخول'
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            ليس لديك حساب؟{' '}
            <Link to="/register" className="text-primary hover:underline">
              إنشاء حساب جديد
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-20 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative glass-card p-12 text-center">
            <img src="/logo.png" alt="KubeCut Logo" className="h-10 w-10 object-contain" />
            <h2 className="mb-4 text-2xl font-bold">منصةكيوب كت</h2>
            <p className="max-w-sm text-muted-foreground">
              منصة متكاملة لحساب وتقطيع وحدات المطابخ بدقة واحترافية عالية
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
