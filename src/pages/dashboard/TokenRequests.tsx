import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { walletApi, TokenRequest } from '@/lib/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { toast } from 'sonner';

const TokenRequests = () => {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['tokenRequests', page, statusFilter],
        queryFn: () => walletApi.getRequests(statusFilter, page, 50)
    });

    const approveMutation = useMutation({
        mutationFn: walletApi.approveRequest,
        onSuccess: () => {
            toast.success("تم الموافقة على الطلب وإضافة الرصيد");
            queryClient.invalidateQueries({ queryKey: ['tokenRequests'] });
        },
        onError: () => toast.error("حدث خطأ أثناء الموافقة")
    });

    const rejectMutation = useMutation({
        mutationFn: walletApi.rejectRequest,
        onSuccess: () => {
             toast.success("تم رفض الطلب");
             queryClient.invalidateQueries({ queryKey: ['tokenRequests'] });
        },
        onError: () => toast.error("حدث خطأ أثناء الرفض")
    });

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'pending': return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20"><Clock className="w-3 h-3 mr-1"/> قيد الانتظار</Badge>;
            case 'approved': return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20"><CheckCircle2 className="w-3 h-3 mr-1"/> مكتمل</Badge>;
            case 'rejected': return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20"><XCircle className="w-3 h-3 mr-1"/> مرفوض</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-amber-500">طلبات شراء التوكنز</h1>
                <div className="flex gap-2">
                    <Button variant={statusFilter === '' ? 'default' : 'outline'} onClick={() => setStatusFilter('')} size="sm">الكل</Button>
                    <Button variant={statusFilter === 'pending' ? 'default' : 'outline'} onClick={() => setStatusFilter('pending')} size="sm">قيد الانتظار</Button>
                </div>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-right">التاريخ</TableHead>
                            <TableHead className="text-right">العميل</TableHead>
                            <TableHead className="text-right">المبلغ (توكن)</TableHead>
                            <TableHead className="text-right">السعر (ج.م)</TableHead>
                            <TableHead className="text-right">ملاحظات</TableHead>
                            <TableHead className="text-right">الحالة</TableHead>
                            <TableHead className="text-right">إجراءات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : data?.requests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                    لا توجد طلبات
                                </TableCell>
                            </TableRow>
                        ) : (
                            data?.requests.map((req: TokenRequest) => (
                                <TableRow key={req.id}>
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        <div>{format(new Date(req.created_at), 'dd/MM/yyyy')}</div>
                                        <div>{format(new Date(req.created_at), 'hh:mm a')}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{req.user_name || 'غير معروف'}</div>
                                        <div className="text-xs text-muted-foreground">{req.user_phone}</div>
                                    </TableCell>
                                    <TableCell className="font-bold text-lg">{req.amount}</TableCell>
                                    <TableCell className="font-mono">{req.price} ج.م</TableCell>
                                    <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">{req.notes}</TableCell>
                                    <TableCell>{getStatusBadge(req.status)}</TableCell>
                                    <TableCell>
                                        {req.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <Button 
                                                    size="sm" 
                                                    className="bg-green-600 hover:bg-green-700 h-8 px-2"
                                                    onClick={() => {
                                                        if(confirm('موافقة على الطلب وإضافة الرصيد؟')) approveMutation.mutate(req.id);
                                                    }}
                                                    disabled={approveMutation.isPending}
                                                >
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    variant="destructive"
                                                    className="h-8 px-2"
                                                    onClick={() => {
                                                        if(confirm('رفض الطلب؟')) rejectMutation.mutate(req.id);
                                                    }}
                                                    disabled={rejectMutation.isPending}
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default TokenRequests;
