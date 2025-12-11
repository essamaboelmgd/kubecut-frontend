import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Layers,
  Ruler,
  Calculator,
  DollarSign,
  Package,
  Grid3X3,
  Scissors,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Unit, CostEstimate, InternalCounter, EdgeBreakdown, UnitPart } from '@/lib/api';

const unitTypeLabels: Record<string, string> = {
  ground: 'وحدة أرضية',
  wall: 'وحدة حائطية',
  double_door: 'وحدة بابين',
  sink_ground: 'وحدة حوض',
};

// Mock detailed unit data
const mockUnit: Unit & { parts: UnitPart[] } = {
  id: '1',
  type: 'ground',
  width: 600,
  height: 850,
  depth: 560,
  shelves_count: 2,
  parts: [
    { name: 'الجانب الأيمن', width: 560, height: 850, quantity: 1 },
    { name: 'الجانب الأيسر', width: 560, height: 850, quantity: 1 },
    { name: 'القاعدة', width: 564, height: 560, quantity: 1 },
    { name: 'السقف', width: 564, height: 560, quantity: 1 },
    { name: 'الظهر', width: 596, height: 846, quantity: 1 },
    { name: 'رف', width: 564, height: 520, quantity: 2 },
    { name: 'الباب', width: 597, height: 715, quantity: 1 },
  ],
  total_area: 2.85,
  total_edge_length: 14.2,
};

export default function UnitDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [unit, setUnit] = useState<Unit & { parts: UnitPart[] }>(mockUnit);
  const [costEstimate, setCostEstimate] = useState<CostEstimate | null>(null);
  const [internalCounter, setInternalCounter] = useState<InternalCounter | null>(null);
  const [edgeBreakdown, setEdgeBreakdown] = useState<EdgeBreakdown | null>(null);
  const [isLoadingCost, setIsLoadingCost] = useState(false);
  const [isLoadingCounter, setIsLoadingCounter] = useState(false);
  const [isLoadingEdge, setIsLoadingEdge] = useState(false);

  // Simulate fetching unit details
  useEffect(() => {
    // In real implementation, fetch from API
    // unitsApi.getById(id).then(setUnit);
  }, [id]);

  const handleCalculateCost = async () => {
    setIsLoadingCost(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      setCostEstimate({
        material_cost: 1250,
        edge_cost: 180,
        total: 1430,
      });
      toast({
        title: 'تم الحساب',
        description: 'تم حساب تكلفة المواد بنجاح',
      });
    } catch {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء حساب التكلفة',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingCost(false);
    }
  };

  const handleCalculateCounter = async () => {
    setIsLoadingCounter(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setInternalCounter({
        drawers: 2,
        shelves: unit.shelves_count,
      });
      toast({
        title: 'تم الحساب',
        description: 'تم حساب الأدراج والرفوف',
      });
    } catch {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء الحساب',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingCounter(false);
    }
  };

  const handleGetEdgeBreakdown = async () => {
    setIsLoadingEdge(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      setEdgeBreakdown({
        edges: [
          { type: 'حافة سميكة 2مم', length: 8.4 },
          { type: 'حافة رفيعة 0.4مم', length: 5.8 },
        ],
        total: 14.2,
      });
      toast({
        title: 'تم التحميل',
        description: 'تم تحميل تفاصيل الشريط',
      });
    } catch {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تحميل البيانات',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingEdge(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowRight className="h-4 w-4" />
          العودة
        </Button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <span className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                {unitTypeLabels[unit.type]}
              </span>
            </div>
            <h1 className="text-2xl font-bold md:text-3xl">تفاصيل الوحدة</h1>
            <p className="mt-1 text-muted-foreground">
              عرض حسابات التقطيع والأجزاء والتكلفة
            </p>
          </div>
        </div>
      </motion.div>

      {/* Dimensions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
              <Ruler className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{unit.width} مم</p>
              <p className="text-sm text-muted-foreground">العرض</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-accent/10 p-2.5 text-accent">
              <Ruler className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{unit.height} مم</p>
              <p className="text-sm text-muted-foreground">الارتفاع</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
              <Ruler className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{unit.depth} مم</p>
              <p className="text-sm text-muted-foreground">العمق</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-accent/10 p-2.5 text-accent">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{unit.shelves_count}</p>
              <p className="text-sm text-muted-foreground">عدد الرفوف</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="flex flex-wrap gap-3"
      >
        <Button
          variant="hero"
          onClick={handleCalculateCost}
          disabled={isLoadingCost}
        >
          {isLoadingCost ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <DollarSign className="h-4 w-4" />
          )}
          حساب التكلفة
        </Button>
        <Button
          variant="outline"
          onClick={handleCalculateCounter}
          disabled={isLoadingCounter}
        >
          {isLoadingCounter ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Grid3X3 className="h-4 w-4" />
          )}
          حساب الأدراج
        </Button>
        <Button
          variant="outline"
          onClick={handleGetEdgeBreakdown}
          disabled={isLoadingEdge}
        >
          {isLoadingEdge ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Scissors className="h-4 w-4" />
          )}
          تفاصيل الشريط
        </Button>
      </motion.div>

      {/* Results Cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cost Estimate */}
        {costEstimate && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6"
          >
            <div className="mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">تقدير التكلفة</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">تكلفة المواد</span>
                <span className="font-medium">{costEstimate.material_cost} ج.م</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">تكلفة الشريط</span>
                <span className="font-medium">{costEstimate.edge_cost} ج.م</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">الإجمالي</span>
                  <span className="text-xl font-bold text-primary">
                    {costEstimate.total} ج.م
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Internal Counter */}
        {internalCounter && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6"
          >
            <div className="mb-4 flex items-center gap-2">
              <Grid3X3 className="h-5 w-5 text-accent" />
              <h3 className="font-semibold">العناصر الداخلية</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">عدد الأدراج</span>
                <span className="text-xl font-bold">{internalCounter.drawers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">عدد الرفوف</span>
                <span className="text-xl font-bold">{internalCounter.shelves}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Edge Breakdown */}
        {edgeBreakdown && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6"
          >
            <div className="mb-4 flex items-center gap-2">
              <Scissors className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">توزيع الشريط</h3>
            </div>
            <div className="space-y-3">
              {edgeBreakdown.edges.map((edge, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{edge.type}</span>
                  <span className="font-medium">{edge.length} م</span>
                </div>
              ))}
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">الإجمالي</span>
                  <span className="text-xl font-bold text-primary">
                    {edgeBreakdown.total} م
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Parts List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="glass-card overflow-hidden"
      >
        <div className="border-b border-border p-5">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">قائمة الأجزاء</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-4 text-right text-sm font-medium text-muted-foreground">
                  القطعة
                </th>
                <th className="p-4 text-right text-sm font-medium text-muted-foreground">
                  العرض (مم)
                </th>
                <th className="p-4 text-right text-sm font-medium text-muted-foreground">
                  الارتفاع (مم)
                </th>
                <th className="p-4 text-right text-sm font-medium text-muted-foreground">
                  الكمية
                </th>
                <th className="p-4 text-right text-sm font-medium text-muted-foreground">
                  المساحة (م²)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {unit.parts.map((part, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.03 }}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4 font-medium">{part.name}</td>
                  <td className="p-4">{part.width}</td>
                  <td className="p-4">{part.height}</td>
                  <td className="p-4">{part.quantity}</td>
                  <td className="p-4">
                    {((part.width * part.height * part.quantity) / 1000000).toFixed(3)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
            <tfoot className="bg-muted/30">
              <tr>
                <td colSpan={4} className="p-4 font-semibold">
                  الإجمالي
                </td>
                <td className="p-4 font-bold text-primary">
                  {unit.total_area.toFixed(2)} م²
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="grid gap-4 sm:grid-cols-2"
      >
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي المساحة</p>
              <p className="text-2xl font-bold">{unit.total_area} م²</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-accent/10 p-2.5 text-accent">
              <Scissors className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي شريط الحافة</p>
              <p className="text-2xl font-bold">{unit.total_edge_length} م</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
