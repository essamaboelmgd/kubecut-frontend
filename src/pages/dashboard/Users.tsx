import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users as UsersIcon,
  Search,
  Shield,
  ShieldAlert,
  Loader2,
  Phone
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
import { authApi, type User } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not admin
    if (currentUser && currentUser.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    const fetchUsers = async () => {
      try {
        const data = await authApi.listUsers();
        setUsers(data);
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

    if (currentUser?.role === 'admin') {
      fetchUsers();
    }
  }, [currentUser, navigate, toast]);

  const filteredUsers = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.includes(search)
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
        <h1 className="text-2xl font-bold md:text-3xl">إدارة المستخدمين</h1>
        <p className="mt-1 text-muted-foreground">
          عرض وإدارة جميع مستخدمي النظام
        </p>
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

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="glass-card overflow-hidden ring-1 ring-white/10"
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40 text-xs uppercase tracking-wider">
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="py-4 px-6 text-right font-bold text-muted-foreground">الاسم</TableHead>
                <TableHead className="py-4 px-6 text-right font-bold text-muted-foreground">رقم الهاتف</TableHead>
                <TableHead className="py-4 px-6 text-right font-bold text-muted-foreground">الدور</TableHead>
                <TableHead className="py-4 px-6 text-right font-bold text-muted-foreground">تاريخ التسجيل</TableHead>
                <TableHead className="py-4 px-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border/30 font-medium">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <TableRow key={u.user_id} className="hover:bg-primary/5 transition-colors border-border/30">
                    <TableCell className="py-4 px-6 font-medium">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                          {u.full_name?.charAt(0) || 'U'}
                        </div>
                        <span className="font-semibold">{u.full_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center gap-2 font-mono text-muted-foreground" dir="ltr">
                        <Phone className="h-3.5 w-3.5" />
                        {u.phone}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <Badge variant={u.role === 'admin' ? 'destructive' : 'secondary'} className={`gap-1 px-2.5 py-1 ${u.role === 'admin' ? 'shadow-sm shadow-destructive/20' : ''}`}>
                        {u.role === 'admin' ? <ShieldAlert className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                        {u.role === 'admin' ? 'مسؤول' : 'مستخدم'}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-muted-foreground text-sm">
                      {/* Assuming backend might not send created_at in some cases or format issues, handle gracefully */}
                      {u.subscription?.start_date ? new Date(u.subscription.start_date).toLocaleDateString('ar-EG') : '-'}
                    </TableCell>
                    <TableCell className="py-4 px-6 text-left">
                      {/* Actions could go here */}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                        <Search className="h-8 w-8 opacity-20" />
                        <p>لا توجد نتائج مطابقة للبحث</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  );
}
