import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Coins, 
    Calendar, 
    ArrowUpRight, 
    ArrowDownLeft, 
    Loader2,
    Wallet,
    History
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Mock data for now, as backend endpoint for history might not exist yet
// You can replace this with actual API call later
interface Transaction {
    id: string;
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    date: string;
    balance_after: number;
}

const MOCK_HISTORY: Transaction[] = [
    { id: '1', type: 'credit', amount: 100, description: 'شحن رصيد شهري', date: '2024-03-01T10:00:00', balance_after: 100 },
    { id: '2', type: 'debit', amount: 1, description: 'استهلاك وحدة', date: '2024-03-02T14:30:00', balance_after: 99 },
    { id: '3', type: 'debit', amount: 3, description: 'استهلاك وحدات', date: '2024-03-05T09:15:00', balance_after: 96 },
    { id: '4', type: 'credit', amount: 50, description: 'بونص إضافي', date: '2024-03-10T16:45:00', balance_after: 146 },
];

export default function WalletHistory() {
    const { user } = useAuth();
    const [history, setHistory] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate API fetch
        setTimeout(() => {
            setHistory(MOCK_HISTORY);
            setIsLoading(false);
        }, 1000);
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-4"
            >
                <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500">
                    <Wallet className="h-8 w-8" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold md:text-3xl">سجل المحفظة</h1>
                    <p className="text-muted-foreground">تتبع استهلاك الوحدات ورصيدك الحالي</p>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="border-primary/20 bg-primary/5">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">الرصيد الحالي</CardTitle>
                            <Coins className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {user?.subscription?.is_unlimited_units ? 'غير محدود' : user?.subscription?.max_units_per_month}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">وحدة متاحة</p>
                        </CardContent>
                    </Card>
                </motion.div>

                 <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">استهلاك الشهر</CardTitle>
                            <ArrowDownLeft className="h-4 w-4 text-destructive" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">4</div> 
                            {/* NOTE: We might need to fetch this from backend distinct from user object if not updated instantly */}
                            <p className="text-xs text-muted-foreground mt-1">وحدة مستخدمة</p>
                        </CardContent>
                    </Card>
                </motion.div>

                 <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي المضاف</CardTitle>
                            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">150</div>
                             {/* Mock value */}
                            <p className="text-xs text-muted-foreground mt-1">وحدة منذ البداية</p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Transactions Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card overflow-hidden ring-1 ring-white/10"
            >
                <div className="p-6 flex items-center gap-2 border-b border-border/50">
                    <History className="h-5 w-5 text-muted-foreground" />
                    <h2 className="font-semibold text-lg">سجل العمليات</h2>
                </div>
                
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/40 text-xs uppercase tracking-wider">
                            <TableRow className="hover:bg-transparent border-border/50">
                                <TableHead className="text-right">نوع العملية</TableHead>
                                <TableHead className="text-right">التفاصيل</TableHead>
                                <TableHead className="text-right">التاريخ</TableHead>
                                <TableHead className="text-right">القيمة</TableHead>
                                <TableHead className="text-right">الرصيد بعد</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-border/30 font-medium">
                            {history.map((tx) => (
                                <TableRow key={tx.id} className="hover:bg-primary/5 transition-colors border-border/30">
                                    <TableCell className="py-4">
                                        <Badge 
                                            variant="outline" 
                                            className={
                                                tx.type === 'credit' 
                                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                                                : 'bg-red-500/10 text-red-600 border-red-500/20'
                                            }
                                        >
                                            {tx.type === 'credit' ? 'إضافة رصيد' : 'خصم رصيد'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-4">{tx.description}</TableCell>
                                    <TableCell className="py-4 text-muted-foreground text-sm" dir="ltr">
                                        {new Date(tx.date).toLocaleDateString('ar-EG', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </TableCell>
                                    <TableCell className="py-4 font-bold" dir="ltr">
                                        <span className={tx.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}>
                                            {tx.type === 'credit' ? '+' : '-'}{tx.amount}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-4 font-mono text-muted-foreground" dir="ltr">
                                        {tx.balance_after}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </motion.div>
        </div>
    );
}
