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
    Crown,
    CheckCircle2,
    MessageCircle,
    Copy,
    Info,
    LayoutTemplate
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { walletApi, Transaction } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useState } from "react";

const WalletHistory = () => {
    const { user, refetchUser } = useAuth();
    const [page] = useState(1);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [lastRequestId, setLastRequestId] = useState("");
    const [lastRequestAmount, setLastRequestAmount] = useState(0);
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

    // Request Topup Mutation
    const requestMutation = useMutation({
        mutationFn: async ({ amount, notes }: { amount: number, notes?: string }) => {
            return walletApi.requestTopup(amount, notes);
        },
        onSuccess: (data, variables) => {
            setLastRequestId(data.request_id);
            setLastRequestAmount(variables.amount);
            setShowSuccessDialog(true);
            toast.success("تم إرسال طلبك بنجاح");
        },
        onError: () => {
            toast.error("فشل إرسال الطلب، حاول مرة أخرى");
        }
    });

    const handleRequestTokens = (amount: number) => {
        if (confirm(`هل تود طلب شراء ${amount} توكن بسعر ${amount * 5} جنيه؟`)) {
            requestMutation.mutate({
                amount,
                notes: `شراء باقة ${amount} توكن`
            });
        }
    };

    // Copy Request ID
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.info("تم نسخ رقم الطلب");
    };

    if (statsLoading || !user) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    const packages = [
        { amount: 0, label: "باقة المبتدئين", icon: Coins, color: "blue", popular: false },
        { amount: 0, label: "باقة المحترفين", icon: Zap, color: "indigo", popular: true },
        { amount: 0, label: "باقة الشركات", icon: Crown, color: "amber", popular: false },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-right mb-2 text-amber-500">محفظة التوكنز</h1>
                <p className="text-muted-foreground text-right">
                    اشحن رصيدك واستخدم التوكنز في حساب وتفصيل الوحدات
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium">الرصيد الحالي</CardTitle>
                        <Wallet className="h-4 w-4 text-amber-600" />
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                            {user.wallet_balance ?? 0} <span className="text-sm font-normal text-muted-foreground">توكن</span>
                        </div>
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
                    </CardContent>
                </Card>
            </div>

            {/* Usage Info Section */}
            <div className="bg-muted/30 border border-dashed rounded-lg p-6 my-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-amber-500" />
                    فيما تستخدم التوكنز؟
                </h3>
                <div className="grid gap-4 md:grid-cols-3 text-center">
                    <div className="p-4 bg-background rounded-md border flex flex-col items-center gap-3">
                        <LayoutTemplate className="w-8 h-8 text-blue-500" />
                        <span className="font-bold">حساب تفصيل</span>
                        <p className="text-sm text-muted-foreground">يتم خصم 1 توكن لكل وحدة في المشروع عند إجراء عملية حساب التفصيل (Cutting Optimization).</p>
                    </div>
                    <div className="p-4 bg-background rounded-md border flex flex-col items-center gap-3">
                        <History className="w-8 h-8 text-indigo-500" />
                        <span className="font-bold">حفظ المشاريع</span>
                        <p className="text-sm text-muted-foreground">التوكنز تمكنك من حفظ عدد غير محدود من المشاريع والوصول إليها لاحقاً.</p>
                    </div>
                    <div className="p-4 bg-background rounded-md border flex flex-col items-center gap-3">
                        <Zap className="w-8 h-8 text-amber-500" />
                        <span className="font-bold">مميزات حصرية</span>
                        <p className="text-sm text-muted-foreground">استمتع بمميزات متقدمة ودعم فني متميز مع باقات التوكنز.</p>
                    </div>
                </div>
            </div>

            {/* Token Packages */}
            <div>
                <h2 className="text-xl font-bold mb-4">باقات الشحن</h2>
                <div className="grid gap-6 md:grid-cols-3">
                    {packages.map((pkg) => (
                        <Card key={pkg.amount} className={`relative overflow-hidden cursor-pointer hover:shadow-lg transition-all border-2 ${pkg.popular ? 'border-amber-500 shadow-amber-500/10' : 'border-transparent hover:border-muted'}`}>
                            {pkg.popular && (
                                <div className="absolute top-0 left-0 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-br-lg">
                                    الأكثر طلباً
                                </div>
                            )}
                            <CardHeader className="text-center pb-2">
                                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-2 bg-${pkg.color}-100 text-${pkg.color}-600 dark:bg-${pkg.color}-900/30 dark:text-${pkg.color}-400`}>
                                    <pkg.icon className="w-6 h-6" />
                                </div>
                                <CardTitle>{pkg.label}</CardTitle>
                                <CardDescription>{pkg.amount} توكن</CardDescription>
                            </CardHeader>
                            <CardContent className="text-center">
                                <div className="text-3xl font-bold mb-1">
                                    {pkg.amount * 5} <span className="text-sm font-normal text-muted-foreground">ج.م</span>
                                </div>
                                <p className="text-xs text-muted-foreground">0 جنيه / توكن</p>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full font-bold gap-2"
                                    variant={pkg.popular ? "default" : "outline"}
                                    onClick={() => handleRequestTokens(pkg.amount)}
                                    disabled={requestMutation.isPending}
                                >
                                    {requestMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "طلب شراء"}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
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
                </CardContent>
            </Card>

            {/* Success Dialog */}
            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent>
                    <DialogHeader>
                        <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <DialogTitle className="text-center text-xl">تم إرسال طلب الشراء بنجاح!</DialogTitle>
                        <DialogDescription className="text-center">
                            الخطوة التالية: يرجى التواصل معنا عبر واتساب لإتمام عملية الدفع وتفعيل الرصيد.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-4 bg-muted rounded-lg space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">رقم الطلب:</span>
                            <div className="flex items-center gap-2 font-mono font-bold">
                                <span>{lastRequestId.slice(-6)}</span>
                                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => copyToClipboard(lastRequestId)}>
                                    <Copy className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">المبلغ المطلوب:</span>
                            <span className="font-bold">{lastRequestAmount * 5} ج.م</span>
                        </div>
                    </div>

                    <DialogFooter className="flex-col gap-2 sm:justify-center">
                        <Button className="w-full gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white" asChild>
                            <a
                                href={`https://wa.me/201024739491?text=${encodeURIComponent(`مرحباً، أرغب في تأكيد طلب شراء توكنز رقم #${lastRequestId.slice(-6)} بقيمة ${lastRequestAmount * 5} جنيه`)}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <MessageCircle className="w-4 h-4" />
                                تأكيد الطلب عبر واتساب
                            </a>
                        </Button>
                        <Button variant="outline" onClick={() => setShowSuccessDialog(false)} className="w-full">
                            إغلاق
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default WalletHistory;
