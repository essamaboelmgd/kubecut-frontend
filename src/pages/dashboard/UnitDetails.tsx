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
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { unitsApi, type Unit, type CostEstimate, type InternalCounter, type EdgeBreakdown } from '@/lib/api';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const unitTypeLabels: Record<string, string> = {
  ground: 'وحدة أرضية',
  wall: 'وحدة حائطية',
  double_door: 'وحدة بابين',
  sink_ground: 'وحدة حوض',
};

export default function UnitDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [unit, setUnit] = useState<Unit | null>(null);
  const [costEstimate, setCostEstimate] = useState<CostEstimate | null>(null);
  const [internalCounter, setInternalCounter] = useState<InternalCounter | null>(null);
  const [edgeBreakdown, setEdgeBreakdown] = useState<EdgeBreakdown | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCost, setIsLoadingCost] = useState(false);
  const [isLoadingCounter, setIsLoadingCounter] = useState(false);
  const [isLoadingEdge, setIsLoadingEdge] = useState(false);

  useEffect(() => {
    const fetchUnit = async () => {
      if (!id) return;
      try {
        const data = await unitsApi.getById(id);
        setUnit(data);
      } catch (error) {
        toast({
          title: 'خطأ',
          description: 'فشل تحميل تفاصيل الوحدة',
          variant: 'destructive',
        });
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUnit();
  }, [id, navigate, toast]);

  const handleCalculateCost = async () => {
    if (!unit) return;
    setIsLoadingCost(true);
    try {
      // Send unit dimensions for cost estimation
      const data = await unitsApi.estimate({
        type: unit.type,
        width_cm: unit.width_cm,
        height_cm: unit.height_cm,
        depth_cm: unit.depth_cm,
        shelf_count: unit.shelf_count || 0,
      });
      setCostEstimate(data);
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
    if (!unit) return;
    setIsLoadingCounter(true);
    try {
      // Get the unit_id from the unit object (backend returns unit_id)
      const unitId = (unit as any).unit_id || unit.id;
      const data = await unitsApi.calculateInternalCounter(unitId);
      setInternalCounter(data);
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
    if (!unit) return;
    setIsLoadingEdge(true);
    try {
      // Get the unit_id from the unit object (backend returns unit_id)
      const unitId = (unit as any).unit_id || unit.id;
      const data = await unitsApi.getEdgeBreakdown(unitId);
      setEdgeBreakdown(data);
      toast({
        title: 'تم التحميل',
        description: 'تم تحميل تفاصيل الشريط',
      });
    } catch {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تحميل التفاصيل',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingEdge(false);
    }
  };

  // Helper to calculate derived stats for Internal Counter
  const getInternalStats = () => {
    if (!internalCounter) return { drawers: 0, shelves: 0 };
    
    // Count drawers by checking for drawer bottoms (one per drawer)
    const drawers = internalCounter.parts
        .filter(p => p.name === 'drawer_bottom')
        .reduce((sum, part) => sum + part.qty, 0);
        
    // Count shelves
    const shelves = internalCounter.parts
        .filter(p => p.type === 'shelf')
        .reduce((sum, part) => sum + part.qty, 0);

    return { drawers, shelves };
  };

  if (isLoading || !unit) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const internalStats = getInternalStats();

  return (
    <div className="space-y-8 max-w-full overflow-x-hidden p-1">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 h-8 px-2 md:h-10 md:px-4"
          onClick={() => navigate(-1)}
        >
          <ArrowRight className="h-4 w-4 ml-2" />
          العودة
        </Button>

        <div className="flex flex-col gap-2 sm:gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 md:gap-3">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs md:text-sm font-medium text-primary">
                {unitTypeLabels[unit.type]}
              </span>
            </div>
            <h1 className="text-xl md:text-3xl font-bold">تفاصيل الوحدة</h1>
            <p className="mt-1 text-sm md:text-base text-muted-foreground">
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
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          <div className="glass-card p-3 md:p-5">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <Ruler className="h-4 w-4 md:h-5 md:w-5" />
              </div>
              <div className="overflow-hidden min-w-0">
                <p className="text-base md:text-2xl font-bold truncate">{unit.width_cm} <span className="text-xs font-normal text-muted-foreground">سم</span></p>
                <p className="text-xs md:text-sm text-muted-foreground truncate">العرض</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-3 md:p-5">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="rounded-lg bg-accent/10 p-2 text-accent">
                <Ruler className="h-4 w-4 md:h-5 md:w-5" />
              </div>
              <div className="overflow-hidden min-w-0">
                <p className="text-base md:text-2xl font-bold truncate">{unit.height_cm} <span className="text-xs font-normal text-muted-foreground">سم</span></p>
                <p className="text-xs md:text-sm text-muted-foreground truncate">الارتفاع</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-3 md:p-5">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <Ruler className="h-4 w-4 md:h-5 md:w-5" />
              </div>
              <div className="overflow-hidden min-w-0">
                <p className="text-base md:text-2xl font-bold truncate">{unit.depth_cm} <span className="text-xs font-normal text-muted-foreground">سم</span></p>
                <p className="text-xs md:text-sm text-muted-foreground truncate">العمق</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-3 md:p-5">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="rounded-lg bg-accent/10 p-2 text-accent">
                <Layers className="h-4 w-4 md:h-5 md:w-5" />
              </div>
              <div className="overflow-hidden min-w-0">
                <p className="text-base md:text-2xl font-bold truncate">{unit.shelf_count || 0}</p>
                <p className="text-xs md:text-sm text-muted-foreground truncate">الرفوف</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:gap-3"
      >
        <Button
          variant="hero"
          onClick={handleCalculateCost}
          disabled={isLoadingCost}
          className="col-span-2 sm:col-span-1 sm:flex-none"
        >
          {isLoadingCost ? (
            <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
          ) : (
            <DollarSign className="h-4 w-4 ml-2" />
          )}
          حساب التكلفة
        </Button>
        <Button
          variant="outline"
          onClick={handleCalculateCounter}
          disabled={isLoadingCounter}
          className="col-span-1 sm:flex-none text-xs px-2 md:text-sm md:px-4"
        >
          {isLoadingCounter ? (
            <RefreshCw className="h-3 w-3 md:h-4 md:w-4 ml-1.5 animate-spin" />
          ) : (
            <Grid3X3 className="h-3 w-3 md:h-4 md:w-4 ml-1.5" />
          )}
          حساب الأدراج
        </Button>
        <Button
          variant="outline"
          onClick={handleGetEdgeBreakdown}
          disabled={isLoadingEdge}
          className="col-span-1 sm:flex-none text-xs px-2 md:text-sm md:px-4"
        >
          {isLoadingEdge ? (
            <RefreshCw className="h-3 w-3 md:h-4 md:w-4 ml-1.5 animate-spin" />
          ) : (
            <Scissors className="h-3 w-3 md:h-4 md:w-4 ml-1.5" />
          )}
          تفاصيل الشريط
        </Button>
      </motion.div>

      {/* Results Cards */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Cost Estimate */}
        {costEstimate && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-4 md:p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent"
          >
            <div className="mb-4 flex items-center gap-3">
               <div className="rounded-xl bg-primary/20 p-2 text-primary ring-1 ring-primary/30">
                  <DollarSign className="h-5 w-5" />
               </div>
              <h3 className="font-bold text-base md:text-lg">تقدير التكلفة</h3>
            </div>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center justify-between p-3 bg-background/40 rounded-lg border border-white/5 text-sm md:text-base">
                <span className="text-muted-foreground">تكلفة المواد</span>
                <span className="font-bold font-mono">
                  {costEstimate.cost_breakdown?.['ألواح الخشب']?.toFixed(2) || '0.00'} ج.م
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background/40 rounded-lg border border-white/5 text-sm md:text-base">
                <span className="text-muted-foreground">تكلفة الشريط</span>
                <span className="font-bold font-mono">
                  {costEstimate.cost_breakdown?.['شريط الحافة']?.toFixed(2) || '0.00'} ج.م
                </span>
              </div>
              <div className="border-t border-primary/20 pt-3 md:pt-4 mt-2">
                <div className="flex items-center justify-between px-2">
                  <span className="font-bold text-lg">الإجمالي</span>
                  <span className="text-xl md:text-2xl font-bold text-primary font-mono">
                    {costEstimate.total_cost?.toFixed(2) || '0.00'} <span className="text-sm font-sans text-muted-foreground font-normal">ج.م</span>
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
            className="glass-card p-4 md:p-6 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-accent/20 p-2 text-accent ring-1 ring-accent/30">
                 <Grid3X3 className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base md:text-lg">العناصر الداخلية</h3>
            </div>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center justify-between p-3 md:p-4 bg-background/40 rounded-lg border border-white/5">
                <span className="text-muted-foreground font-medium text-sm md:text-base">عدد الأدراج</span>
                <span className="text-xl md:text-2xl font-bold font-mono">{internalStats.drawers}</span>
              </div>
              <div className="flex items-center justify-between p-3 md:p-4 bg-background/40 rounded-lg border border-white/5">
                <span className="text-muted-foreground font-medium text-sm md:text-base">عدد الرفوف</span>
                <span className="text-xl md:text-2xl font-bold font-mono">{internalStats.shelves}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Edge Breakdown */}
        {edgeBreakdown && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
             className="glass-card p-4 md:p-6 border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-blue-500/20 p-2 text-blue-500 ring-1 ring-blue-500/30">
                <Scissors className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base md:text-lg">توزيع الشريط</h3>
            </div>
             <div className="space-y-2 md:space-y-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
              {edgeBreakdown.parts?.map((part, index) => (
                <div key={index} className="flex items-center justify-between text-xs md:text-sm p-2 bg-background/30 rounded-lg hover:bg-background/50 transition-colors">
                  <span className="text-muted-foreground font-medium">{part.part_name}</span>
                  <span className="font-bold font-mono">{part.total_edge_m.toFixed(2)} م</span>
                </div>
              ))}
              </div>
              <div className="border-t border-blue-500/20 pt-3 mt-auto">
                <div className="flex items-center justify-between px-2">
                  <span className="font-bold text-sm md:text-base">الإجمالي</span>
                  <span className="text-lg md:text-xl font-bold text-blue-500 font-mono">
                    {edgeBreakdown.total_edge_m?.toFixed(2) || '0.00'} م
                  </span>
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
        className="glass-card overflow-hidden ring-1 ring-white/10"
      >
        <div className="border-b border-border/50 p-4 md:p-6 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Package className="h-4 w-4 md:h-5 md:w-5" />
            </div>
            <div>
                 <h3 className="font-bold text-base md:text-lg">قائمة الأجزاء</h3>
                 <p className="text-xs md:text-sm text-muted-foreground">تفاصيل أبعاد وكميات أجزاء الوحدة</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table className="w-full min-w-[600px]">
            <TableHeader className="bg-muted/40 text-xs uppercase tracking-wider">
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="py-3 px-3 md:py-4 md:px-6 text-right font-bold text-muted-foreground">
                  القطعة
                </TableHead>
                <TableHead className="py-3 px-3 md:py-4 md:px-6 text-right font-bold text-muted-foreground">
                  العرض (سم)
                </TableHead>
                <TableHead className="py-3 px-3 md:py-4 md:px-6 text-right font-bold text-muted-foreground">
                  الارتفاع (سم)
                </TableHead>
                <TableHead className="py-3 px-3 md:py-4 md:px-6 text-right font-bold text-muted-foreground">
                  الكمية
                </TableHead>
                <TableHead className="py-3 px-3 md:py-4 md:px-6 text-right font-bold text-muted-foreground">
                  المساحة (م²)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border/30 font-medium text-sm md:text-base">
              {unit.parts?.map((part, i) => {
                const partTranslations: Record<string, string> = {
                  'base': 'قاعدة',
                  'top': 'سقف',
                  'left_side': 'جانب أيسر',
                  'right_side': 'جانب أيمن',
                  'side_panel': 'جانب',
                  'back_panel': 'ظهر',
                  'shelf': 'رف',
                  'door': 'ضلفة',
                  'front_mirror': 'مراية أمامية',
                  'back_mirror': 'مراية خلفية',
                  'drawer_bottom': 'قاع درج',
                  'drawer_side': 'جانب درج',
                  'drawer_back': 'ظهر درج',
                  'drawer_front': 'وش درج',
                  'internal_base': 'قاعدة داخلية',
                  'internal_shelf': 'رف داخلي', 
                };
                
                return (
                  <TableRow
                    key={i}
                    className="hover:bg-primary/5 transition-colors border-border/30"
                  >
                    <TableCell className="py-3 px-3 md:py-4 md:px-6 font-semibold text-primary">{partTranslations[part.name] || partTranslations[part.name.toLowerCase()] || part.name}</TableCell>
                    <TableCell className="py-3 px-3 md:py-4 md:px-6 font-mono text-muted-foreground">{part.width_cm}</TableCell>
                    <TableCell className="py-3 px-3 md:py-4 md:px-6 font-mono text-muted-foreground">{part.height_cm}</TableCell>
                    <TableCell className="py-3 px-3 md:py-4 md:px-6">
                        <span className="inline-flex items-center justify-center min-w-[2rem] h-6 rounded bg-muted text-xs font-bold">
                            {part.qty}
                        </span>
                    </TableCell>
                    <TableCell className="py-3 px-3 md:py-4 md:px-6 font-mono font-bold text-foreground/80">
                      {part.area_m2?.toFixed(3) || '0.000'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter className="bg-primary/5 border-t border-primary/10">
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={4} className="py-3 px-3 md:py-4 md:px-6 font-bold text-base md:text-lg">
                  الإجمالي
                </TableCell>
                <TableCell className="py-3 px-3 md:py-4 md:px-6 font-bold text-lg md:text-xl text-primary font-mono whitespace-nowrap">
                  {unit.total_area_m2.toFixed(2)} م²
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="grid gap-4 md:grid-cols-2"
      >
        <div className="glass-card p-4 md:p-6 flex items-center justify-between group hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="rounded-xl bg-primary/10 p-2 md:p-3 text-primary ring-1 ring-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Calculator className="h-5 w-5 md:h-6 md:w-6" />
            </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">المساحة الإجمالية</p>
                <p className="text-2xl md:text-3xl font-bold font-mono mt-1">{unit.total_area_m2.toFixed(2)} <span className="text-sm text-muted-foreground">م²</span></p>
              </div>
          </div>
        </div>
        <div className="glass-card p-4 md:p-6 flex items-center justify-between group hover:border-accent/50 transition-colors">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="rounded-xl bg-accent/10 p-2 md:p-3 text-accent ring-1 ring-accent/20 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
              <Scissors className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div>
              <p className="text-xs md:text-sm font-medium text-muted-foreground">إجمالي شريط الحافة</p>
              <p className="text-2xl md:text-3xl font-bold font-mono mt-1">{unit.total_edge_band_m.toFixed(2)} <span className="text-sm text-muted-foreground">م</span></p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
