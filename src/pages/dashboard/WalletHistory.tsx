import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
    Coins, 
    Calendar, 
    ArrowUpRight, 
    ArrowDownLeft, 
    Loader2, 
    Wallet, 
    History,
    Zap,
    Crown
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { walletApi, Transaction } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useState } from "react";

const WalletHistory = () => {
    const { user, refetchUser } = useAuth();
    const [page] = useState(1);
    const queryClient = useQueryClient();

    // Fetch Stats
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['walletStats'],
        queryFn: walletApi.getStats
    });

    // Fetch History
    const { data: historyData, isLoading: historyLoading } = useQuery({
        queryKey: ['walletHistory', page],
        queryFn: () => walletApi.getHistory(page, 10)
    });

    // Top Up Mutation
    const topUpMutation = useMutation({
        mutationFn: async ({ amount, desc }: { amount: number, desc: string }) => {
            return walletApi.topUp(amount, desc);
        },
        onSuccess: () => {
            toast.success("تم شحن الرصيد بنجاح");
            queryClient.invalidateQueries({ queryKey: ['walletStats'] });
            queryClient.invalidateQueries({ queryKey: ['walletHistory'] });
            refetchUser(); // Update header balance
        },
        onError: () => {
            toast.error("حدث خطأ أثناء الشحن");
        }
    });

    const handleBuyTokens = (amount: number, price: number) => {
        // Here you would integrate payment gateway. 
        // For now, we simulate success.
        if (confirm(`هل أنت متأكد من شراء ${amount} وحدة مقابل ${price} جنيه؟`)) {
            topUpMutation.mutate({ 
                amount, 
                desc: `شراء باقة ${amount} وحدة`
            });
        }
    };
    
    // Helper to request subscription upgrade (Mock)
    const handleSubscribe = (plan: string) => {
        toast.info("سيتم تحويلك لبوابة الدفع للاشتراك في " + plan);
        // Implement subscription update logic if backend supports it via this route or redirect
    };

    if (statsLoading || !user) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-right mb-2">محفظة الوحدات</h1>
                <p className="text-muted-foreground text-right">
                    تتبع رصيدك، استهلاكك، وسجل عملياتك
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">الرصيد الحالي</CardTitle>
                        <Wallet className="h-4 w-4 text-amber-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                            {user.wallet_balance ?? 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            وحدة متاحة
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">استهلاك الشهر</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats?.month_consumption ?? 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            وحدة مستخدمة
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">إجمالي المضاف</CardTitle>
                        <Coins className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                             {stats?.total_added ?? 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            وحدة منذ البداية
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Buy / Subscribe Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="cursor-pointer hover:bg-accent/50 transition-colors border-dashed" onClick={() => handleBuyTokens(10, 100)}>
                     <CardContent className="flex flex-col items-center justify-center p-6 gap-3">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            <Coins className="w-6 h-6" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-semibold">باقة صغيرة</h3>
                            <p className="text-sm text-muted-foreground">10 وحدات - 100 ج.م</p>
                        </div>
                     </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-accent/50 transition-colors border-dashed" onClick={() => handleBuyTokens(50, 450)}>
                     <CardContent className="flex flex-col items-center justify-center p-6 gap-3">
                        <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                            <Coins className="w-6 h-6" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-semibold">باقة وسط</h3>
                            <p className="text-sm text-muted-foreground">50 وحدة - 450 ج.م</p>
                        </div>
                     </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:bg-accent/50 transition-colors border-dashed" onClick={() => handleSubscribe('monthly')}>
                     <CardContent className="flex flex-col items-center justify-center p-6 gap-3">
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                            <Zap className="w-6 h-6" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-semibold">اشتراك شهري</h3>
                            <p className="text-sm text-muted-foreground">وحدات بلا حدود</p>
                        </div>
                     </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-accent/50 transition-colors border-dashed bg-gradient-to-br from-amber-500/5 to-transparent border-amber-200 dark:border-amber-800" onClick={() => handleSubscribe('yearly')}>
                     <CardContent className="flex flex-col items-center justify-center p-6 gap-3">
                        <div className="p-3 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                            <Crown className="w-6 h-6" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-semibold">اشتراك سنوي</h3>
                            <p className="text-sm text-muted-foreground">توفير 20%</p>
                        </div>
                     </CardContent>
                </Card>
            </div>

            {/* Transaction History Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <History className="h-5 w-5" />
                        سجل العمليات
                    </CardTitle>
                    <CardDescription>
                        سجل بجميع عمليات الإضافة والخصم
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {historyLoading ? (
                         <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-right">نوع العملية</TableHead>
                                    <TableHead className="text-right">التفاصيل</TableHead>
                                    <TableHead className="text-right">التاريخ</TableHead>
                                    <TableHead className="text-right">القيمة</TableHead>
                                    <TableHead className="text-right">الرصيد بعد</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {historyData?.transactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            لا توجد عمليات مسجلة
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    historyData?.transactions.map((tx: Transaction) => (
                                        <TableRow key={tx.transaction_id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    {tx.type === 'credit' ? (
                                                        <ArrowDownLeft className="h-4 w-4 text-green-500" />
                                                    ) : (
                                                        <ArrowUpRight className="h-4 w-4 text-red-500" />
                                                    )}
                                                    {tx.type === 'credit' ? 'إضافة رصيد' : 'خصم رصيد'}
                                                </div>
                                            </TableCell>
                                            <TableCell>{tx.description}</TableCell>
                                            <TableCell className="text-muted-foreground text-sm" dir="ltr">
                                                {format(new Date(tx.date), 'd MMMM yyyy, hh:mm a', { locale: ar })}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={tx.type === 'credit' ? "default" : "destructive"} className={tx.type === 'credit' ? "bg-green-500 hover:bg-green-600" : ""}>
                                                    {tx.type === 'credit' ? '+' : '-'}{Math.abs(tx.amount)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-bold">{tx.balance_after}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                    
                    {/* Pagination needed? If implemented in backend, yes. */}
                </CardContent>
            </Card>
        </div>
    );
};

export default WalletHistory;
