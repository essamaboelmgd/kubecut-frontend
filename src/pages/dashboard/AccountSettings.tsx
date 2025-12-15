import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function AccountSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [full_name, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: 'تم التحديث',
        description: 'تم تحديث بيانات الحساب بنجاح',
      });
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء التحديث',
        variant: 'destructive',
      });
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: 'خطأ',
        description: 'كلمتا المرور غير متطابقتين',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: 'خطأ',
        description: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل',
        variant: 'destructive',
      });
      return;
    }

    setIsPasswordLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: 'تم التغيير',
        description: 'تم تغيير كلمة المرور بنجاح',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تغيير كلمة المرور',
        variant: 'destructive',
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const userInitials = user?.full_name
    ? user.full_name.slice(0, 2).toUpperCase()
    : 'مس';

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold md:text-3xl">إعدادات الحساب</h1>
        <p className="mt-1 text-muted-foreground">
          إدارة بيانات حسابك الشخصي
        </p>
      </motion.div>

      {/* Avatar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="glass-card flex flex-col sm:flex-row items-center gap-8 p-8 border-primary/10"
      >
        <div className="relative">
             <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60 text-3xl font-bold text-primary-foreground shadow-lg ring-4 ring-background">
                {userInitials}
            </div>
            <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-green-500 ring-2 ring-background" />
        </div>
        
        <div className="text-center sm:text-right space-y-1">
          <h3 className="text-2xl font-bold">{user?.full_name}</h3>
          <p className="text-muted-foreground font-medium flex items-center justify-center sm:justify-start gap-2">
            <Mail className="h-4 w-4" />
            {user?.phone}
          </p>
           <div className="pt-2">
             <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                حساب نشط
             </span>
           </div>
        </div>
      </motion.div>

      {/* Profile Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        onSubmit={handleUpdateProfile}
        className="glass-card space-y-8 p-8"
      >
        <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <User className="h-5 w-5" />
            </div>
            <div>
                <h2 className="text-lg font-bold">البيانات الشخصية</h2>
                <p className="text-sm text-muted-foreground">تحديث معلوماتك الأساسية</p>
            </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">الاسم بالكامل</Label>
            <div className="relative group">
              <User className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-hover:text-primary" />
              <Input
                id="name"
                value={full_name}
                onChange={(e) => setFullName(e.target.value)}
                className="h-12 pr-10 bg-background/50 focus:bg-background transition-colors"
                placeholder="الاسم الثلاثي"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">رقم الهاتف</Label>
            <div className="relative group">
              <Mail className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-hover:text-primary" />
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-12 pr-10 bg-background/50 focus:bg-background transition-colors font-mono"
                dir="ltr"
                placeholder="+20 1xx xxx xxxx"
              />
            </div>
          </div>
        </div>
        <div className="pt-2">
            <Button type="submit" variant="hero" disabled={isProfileLoading} className="w-full sm:w-auto min-w-[150px]">
            {isProfileLoading ? (
                <>
                <Loader2 className="animate-spin mr-2" />
                جاري الحفظ...
                </>
            ) : (
                <>
                <Save className="h-4 w-4 mr-2" />
                حفظ التغييرات
                </>
            )}
            </Button>
        </div>
      </motion.form>

      {/* Password Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        onSubmit={handleChangePassword}
        className="glass-card space-y-8 p-8"
      >
         <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="p-2 bg-accent/10 rounded-lg text-accent">
                <Lock className="h-5 w-5" />
            </div>
            <div>
                <h2 className="text-lg font-bold">تغيير كلمة المرور</h2>
                <p className="text-sm text-muted-foreground">تأمين حسابك بكلمة مرور قوية</p>
            </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
            <div className="relative group">
              <Lock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-hover:text-accent" />
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="h-12 pr-10 bg-background/50 focus:bg-background transition-colors"
                dir="ltr"
              />
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
                <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                <div className="relative group">
                <Lock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-hover:text-accent" />
                <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-12 pr-10 bg-background/50 focus:bg-background transition-colors"
                    dir="ltr"
                />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirmPassword">تأكيد كلمة المرور الجديدة</Label>
                <div className="relative group">
                <Lock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-hover:text-accent" />
                <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 pr-10 bg-background/50 focus:bg-background transition-colors"
                    dir="ltr"
                />
                </div>
            </div>
          </div>
        </div>
        <div className="pt-2">
            <Button type="submit" variant="default" disabled={isPasswordLoading} className="w-full sm:w-auto min-w-[150px] bg-foreground text-background hover:bg-foreground/90">
            {isPasswordLoading ? (
                <>
                <Loader2 className="animate-spin mr-2" />
                جاري التغيير...
                </>
            ) : (
                <>
                <Lock className="h-4 w-4 mr-2" />
                تغيير كلمة المرور
                </>
            )}
            </Button>
        </div>
      </motion.form>
    </div>
  );
}
