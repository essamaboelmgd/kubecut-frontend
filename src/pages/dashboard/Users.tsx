import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Shield,
  ShieldAlert,
  Loader2,
  Phone,
  MoreVertical,
  Settings,
  Trash2,
  Smartphone,
  Zap,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Coins
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { authApi, type User, type UserRole, type UserWithStats } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export default function Users() {
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  // Selection
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  // Bulk Tokens Dialog
  const [isBulkTokensOpen, setIsBulkTokensOpen] = useState(false);
  const [tokensToAdd, setTokensToAdd] = useState(0);
  const [isAddingTokens, setIsAddingTokens] = useState(false);

  // Subscription Dialog State
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSubDialogOpen, setIsSubDialogOpen] = useState(false);
  const [isUpdatingSub, setIsUpdatingSub] = useState(false);
  const [subForm, setSubForm] = useState({
    max_units_per_month: 3,
    max_devices: 1,
    is_unlimited_units: false,
    unlimited_duration: 'forever', // '1_month', 'custom', 'forever'
    custom_months: 1
  });

  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await authApi.listUsers(page, 10, search);
      setUsers(data.users);
      setTotalUsers(data.total);
      setTotalPages(Math.ceil(data.total / 10)); // assuming limit 10
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل تحميل قائمة المستخدمين',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    if (currentUser?.role === 'admin') {
        const timeoutId = setTimeout(() => {
            fetchUsers();
        }, 300); // Debounce search
        return () => clearTimeout(timeoutId);
    }
  }, [currentUser, navigate, page, search]);

  const handleSelectAll = (checked: boolean) => {
      if (checked) {
          setSelectedUsers(users.map(u => u.user_id));
      } else {
          setSelectedUsers([]);
      }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
      if (checked) {
          setSelectedUsers(prev => [...prev, userId]);
      } else {
          setSelectedUsers(prev => prev.filter(id => id !== userId));
      }
  };

  const handleBulkAddTokens = async () => {
      if (tokensToAdd <= 0) return;
      setIsAddingTokens(true);
      try {
          await authApi.bulkAddTokens(selectedUsers, tokensToAdd);
          toast({
              title: "تمت العملية بنجاح",
              description: `تم إضافة ${tokensToAdd} توكن لـ ${selectedUsers.length} عميل`
          });
          setIsBulkTokensOpen(false);
          setTokensToAdd(0);
          setSelectedUsers([]);
          fetchUsers();
      } catch (error) {
          toast({
              title: "خطأ",
              className: "destructive",
              description: "فشل إضافة التوكنز"
          });
      } finally {
          setIsAddingTokens(false);
      }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن تراجع هذا الإجراء.')) return;
    
    setIsDeleting(userId);
    try {
      await authApi.deleteUser(userId);
      toast({
        title: 'تم الحذف',
        description: 'تم حذف المستخدم بنجاح',
      });
      fetchUsers();
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل حذف المستخدم',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleRoleChange = async (userId: string, currentRole: UserRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const action = newRole === 'admin' ? 'ترقية' : 'تخفيض';
    
    if (!window.confirm(`هل أنت متأكد من ${action} هذا المستخدم؟`)) return;

    try {
      await authApi.updateUserRole(userId, newRole);
      toast({
        title: 'تم التحديث',
        description: `تم ${action} المستخدم بنجاح`,
      });
      fetchUsers();
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل تحديث صلاحية المستخدم',
        variant: 'destructive',
      });
    }
  };

  const openSubscriptionDialog = (user: User) => {
    setSelectedUser(user);
    
    // Determine duration type from date
    let duration = 'forever';
    let months = 1;

    if (user.subscription.unlimited_expiry_date) {
      duration = 'custom'; 
    } else {
        duration = 'forever';
    }

    setSubForm({
      max_units_per_month: user.subscription.max_units_per_month,
      max_devices: user.subscription.max_devices,
      is_unlimited_units: user.subscription.is_unlimited_units,
      unlimited_duration: duration,
      custom_months: months
    });
    setIsSubDialogOpen(true);
  };

  const handleSaveSubscription = async () => {
    if (!selectedUser) return;
    setIsUpdatingSub(true);
    
    try {
      let expiryDate = null;
      
      if (subForm.is_unlimited_units && subForm.unlimited_duration !== 'forever') {
        const date = new Date();
        const monthsToAdd = subForm.unlimited_duration === '1_month' ? 1 : subForm.custom_months;
        date.setMonth(date.getMonth() + monthsToAdd);
        expiryDate = date.toISOString();
      }

      const payload = {
        max_units_per_month: subForm.max_units_per_month,
        max_devices: subForm.max_devices,
        is_unlimited_units: subForm.is_unlimited_units,
        is_unlimited_devices: false, // Could be added to UI if needed
        unlimited_expiry_date: expiryDate
      };

      await authApi.updateSubscription(selectedUser.user_id, payload);
      
      toast({
        title: 'تم الحفظ',
        description: 'تم تحديث بيانات الاشتراك بنجاح',
      });
      
      fetchUsers();
      setIsSubDialogOpen(false);
    } catch (error) {
       console.error(error);
      toast({
        title: 'خطأ',
        description: 'فشل تحديث الاشتراك',
        variant: 'destructive',
      });
    } finally {
      setIsUpdatingSub(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold md:text-3xl">إدارة العملاء</h1>
                <p className="mt-1 text-muted-foreground">
                إجمالي عدد العملاء: <span className="font-bold text-primary text-lg">{totalUsers}</span>
                </p>
            </div>
            {selectedUsers.length > 0 && (
                <Button onClick={() => setIsBulkTokensOpen(true)} className="gap-2 bg-amber-500 hover:bg-amber-600 text-black font-bold">
                    <Coins className="h-4 w-4" />
                    شحن توكنز ({selectedUsers.length})
                </Button>
            )}
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="relative max-w-md"
      >
        <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="ابحث بالاسم أو رقم الهاتف..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-12 pr-10"
        />
      </motion.div>

      {/* Desktop Table View */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="hidden md:block glass-card overflow-hidden ring-1 ring-white/10">
          <Table>
            <TableHeader className="bg-muted/40 text-xs uppercase tracking-wider">
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="w-[50px]">
                    <Checkbox 
                        checked={selectedUsers.length === users.length && users.length > 0}
                        onCheckedChange={handleSelectAll}
                    />
                </TableHead>
                <TableHead className="py-4 px-6 text-right font-bold text-muted-foreground">العميل</TableHead>
                <TableHead className="py-4 px-6 text-right font-bold text-muted-foreground">رقم الهاتف</TableHead>
                <TableHead className="py-4 px-6 text-right font-bold text-muted-foreground">مستهلك التوكنز</TableHead>
                <TableHead className="py-4 px-6 text-right font-bold text-muted-foreground">الرصيد</TableHead>
                <TableHead className="py-4 px-6 text-left font-bold text-muted-foreground">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border/30 font-medium">
              {isLoading ? (
                  <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                      </TableCell>
                  </TableRow>
              ) : users.length > 0 ? (
                users.map((u) => (
                  <TableRow key={u.user_id} className="hover:bg-primary/5 transition-colors border-border/30">
                    <TableCell>
                        <Checkbox 
                            checked={selectedUsers.includes(u.user_id)}
                            onCheckedChange={(checked) => handleSelectUser(u.user_id, !!checked)}
                        />
                    </TableCell>
                    <TableCell className="py-4 px-6 font-medium">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                          {u.full_name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold">{u.full_name}</span>
                            <span className="text-xs text-muted-foreground hidden lg:block">
                                {new Date(u.created_at || Date.now()).toLocaleDateString('ar-EG')}
                            </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center gap-2 font-mono text-muted-foreground" dir="ltr">
                        <Phone className="h-3.5 w-3.5" />
                        {u.phone}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                        <div className="flex flex-col">
                            <span className="font-bold text-lg">{u.units_used_all_time} <span className="text-xs font-normal text-muted-foreground">وحدة</span></span>
                            <span className="text-xs text-muted-foreground">الشهر الحالي: {u.units_used_this_month}</span>
                        </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                        <div className="flex items-center gap-1">
                            <Zap className="h-4 w-4 text-amber-500" />
                            {u.subscription.is_unlimited_units ? (
                                <span className="text-amber-500 font-bold">غير محدود</span>
                            ) : (
                                <span className="font-mono font-bold text-lg">{u.subscription.max_units_per_month}</span>
                            )}
                        </div>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-left">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openSubscriptionDialog(u)}>
                                <Settings className="ml-2 h-4 w-4" />
                                إدارة الاشتراك
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeleteUser(u.user_id)}
                            >
                                <Trash2 className="ml-2 h-4 w-4" />
                                حذف المستخدم
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    <p>لا توجد نتائج مطابقة للبحث</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-border/30">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                    >
                        <ChevronRight className="h-4 w-4 ml-2" />
                        السابق
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        صفحة {page} من {totalPages}
                    </span>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                    >
                        التالي
                        <ChevronLeft className="h-4 w-4 mr-2" />
                    </Button>
                </div>
            )}
        </div>

        {/* Mobile Cards View */}
        <div className="grid gap-4 md:hidden">
            {users.length > 0 ? (
                users.map((u) => (
                    <motion.div 
                        key={u.user_id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`glass-card p-4 space-y-4 ${selectedUsers.includes(u.user_id) ? 'ring-1 ring-primary' : ''}`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <Checkbox 
                                    checked={selectedUsers.includes(u.user_id)}
                                    onCheckedChange={(checked) => handleSelectUser(u.user_id, !!checked)}
                                />
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                                    {u.full_name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{u.full_name}</h3>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span dir="ltr">{u.phone}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="-mt-1 -mr-2 h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => openSubscriptionDialog(u)}>
                                        <Settings className="ml-2 h-4 w-4" />
                                        إدارة الاشتراك
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                        className="text-destructive focus:text-destructive"
                                        onClick={() => handleDeleteUser(u.user_id)}
                                    >
                                        <Trash2 className="ml-2 h-4 w-4" />
                                        حذف
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm p-3 bg-muted/20 rounded-lg">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground">استهلاك التوكنز</span>
                                <div className="flex items-center gap-1 font-medium">
                                    <span className="font-bold">{u.units_used_all_time}</span>
                                    <span className="text-xs">وحدة</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground">الرصيد</span>
                                <div className="flex items-center gap-1 font-medium">
                                    <Zap className="h-3.5 w-3.5 text-amber-500" />
                                    {u.subscription.is_unlimited_units ? (
                                        <span className="text-amber-500">غير محدود</span>
                                    ) : (
                                        <span>{u.subscription.max_units_per_month}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))
            ) : (
                 <div className="text-center py-12 text-muted-foreground">
                    <p>لا توجد نتائج</p>
                </div>
            )}
             {/* Mobile Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between p-4">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                    >
                        السابق
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        {page} / {totalPages}
                    </span>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                    >
                        التالي
                    </Button>
                </div>
            )}
        </div>
      </motion.div>

        {/* Subscription Dialog */}
        <Dialog open={isSubDialogOpen} onOpenChange={setIsSubDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>إدارة اشتراك المستخدم</DialogTitle>
                    <DialogDescription>
                        تعديل حدود الوحدات والأجهزة الخاصة بـ {selectedUser?.full_name}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                     {/* Units Limit */}
                     <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="unlimited_units" className="flex flex-col gap-1">
                                <span>عدد وحدات غير محدود</span>
                                <span className="text-xs font-normal text-muted-foreground">تفعيل نظام الباقة المفتوحة</span>
                            </Label>
                            <Switch 
                                id="unlimited_units" 
                                checked={subForm.is_unlimited_units}
                                onCheckedChange={(checked) => setSubForm({...subForm, is_unlimited_units: checked})}
                            />
                        </div>
                        
                        <AnimatePresence>
                            {subForm.is_unlimited_units ? (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="pt-2 overflow-hidden space-y-3"
                                >
                                    <Label>مدة الصلاحية</Label>
                                    <Select 
                                        value={subForm.unlimited_duration} 
                                        onValueChange={(val) => setSubForm({...subForm, unlimited_duration: val})}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="اختر المدة" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1_month">شهر واحد</SelectItem>
                                            <SelectItem value="custom">عدد شهور محدد</SelectItem>
                                            <SelectItem value="forever">مدى الحياة</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {subForm.unlimited_duration === 'custom' && (
                                        <div className="flex items-center gap-2 mt-2">
                                            <Input 
                                                type="number" 
                                                min="1"
                                                value={subForm.custom_months}
                                                onChange={(e) => setSubForm({...subForm, custom_months: parseInt(e.target.value) || 1})}
                                                className="w-20"
                                            />
                                            <span className="text-sm text-muted-foreground">شهر</span>
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="pt-2 space-y-2 overflow-hidden"
                                >
                                    <Label htmlFor="max_units">عدد الوحدات الشهرية</Label>
                                    <Input 
                                        id="max_units" 
                                        type="number" 
                                        value={subForm.max_units_per_month}
                                        onChange={(e) => setSubForm({...subForm, max_units_per_month: parseInt(e.target.value) || 0})}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                     </div>

                    <div className="h-[1px] bg-border" />

                     {/* Devices Limit */}
                     <div className="space-y-3">
                        <Label htmlFor="max_devices">عدد الأجهزة المسموح بها</Label>
                        <Input 
                            id="max_devices" 
                            type="number" 
                            min="1"
                            value={subForm.max_devices}
                            onChange={(e) => setSubForm({...subForm, max_devices: parseInt(e.target.value) || 1})}
                        />
                     </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsSubDialogOpen(false)}>إلغاء</Button>
                    <Button onClick={handleSaveSubscription} disabled={isUpdatingSub}>
                        {isUpdatingSub && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                        حفظ التعديلات
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Bulk Add Tokens Dialog */}
        <Dialog open={isBulkTokensOpen} onOpenChange={setIsBulkTokensOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>شحن توكنز (وحدات)</DialogTitle>
                    <DialogDescription>
                        إضافة وحدات إضافية لـ {selectedUsers.length} عميل محدد
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                     <div className="space-y-3">
                        <Label htmlFor="tokens_to_add">عدد التوكنز للإضافة</Label>
                        <Input 
                            id="tokens_to_add" 
                            type="number" 
                            min="1"
                            value={tokensToAdd}
                            onChange={(e) => setTokensToAdd(parseInt(e.target.value) || 0)}
                            className="text-lg font-bold"
                        />
                     </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsBulkTokensOpen(false)}>إلغاء</Button>
                    <Button onClick={handleBulkAddTokens} disabled={isAddingTokens || tokensToAdd <= 0} className="bg-amber-500 hover:bg-amber-600 text-black">
                        {isAddingTokens && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                        إضافة الرصيد
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
}
