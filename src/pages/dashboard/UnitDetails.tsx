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
  Loader2,
  FileSpreadsheet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { unitsApi, type Unit, type CostEstimate, type InternalCounter, type EdgeBreakdown } from '@/lib/api';
import {
  Table,
  TableBody,
  TableCell,
  // TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const unitTypeLabels: Record<string, string> = {
  ground: 'وحدة أرضية',
  ground_unit: 'وحدة أرضية',
  sink: 'وحدة حوض',
  sink_unit: 'وحدة حوض',
  ground_fixed: 'أرضي ثابت',
  ground_fixed_unit: 'أرضي ثابت',
  sink_fixed: 'حوض ثابت',
  sink_fixed_unit: 'حوض ثابت',
  drawers: 'أدراج (مجرى جنب)',
  drawers_unit: 'أدراج (مجرى جنب)',
  drawers_bottom_rail: 'أدراج (مجرى سفلي)',
  drawers_bottom_rail_unit: 'أدراج (مجرى سفلي)',
  tall_doors: 'دولاب ضلف',
  tall_doors_appliances: 'دولاب ضلف وأجهزة',
  tall_drawers_side_doors_top: 'دولاب درج جنب + ضلف',
  tall_drawers_bottom_rail_top_doors: 'دولاب درج سفلي + ضلف',
  tall_drawers_side_appliances_doors: 'دولاب درج جنب + أجهزة',
  tall_drawers_bottom_appliances_doors_top: 'دولاب درج سفلي + أجهزة',
  tall_wooden_base: 'بلاكار قاعدة خشبية',
  wall: 'علوي ضلف',
  wall_fixed: 'علوي ثابت',
  wall_flip_top_doors_bottom: 'علوي قلاب + ضلف',
  wall_microwave: 'علوي ميكرويف',
  corner_l_wall: 'ركنة L علوي',
  three_turbo: 'وحدة 3 تربو',
  drawer_built_in_oven: 'درج + فرن بيلت إن',
  drawer_bottom_rail_built_in_oven: 'درج سفلي + فرن بيلت إن',
  two_small_20_one_large_side: '2 صغير 20 + 1 كبير (جنب)',
  two_small_20_one_large_bottom: '2 صغير 20 + 1 كبير (سفلي)',
  one_small_16_two_large_side: '1 صغير 16 + 2 كبير (جنب)',
  one_small_16_two_large_bottom: '1 صغير 16 + 2 كبير (سفلي)',
};

// Helper to generate edge marks
const getEdgeMarks = (code: string | undefined) => {
    const marks = { top: "", bottom: "", left: "", right: "" };
    if (!code || code === "-") return marks;
    
    const tape_mark = "-------"; 
    const groove_mark = "م"; 
    
    if (code.includes("OM")) {
        marks.top = tape_mark; marks.bottom = tape_mark; marks.left = tape_mark; marks.right = tape_mark;
    } else if (code.includes("O")) {
        marks.top = tape_mark; marks.bottom = tape_mark; marks.left = tape_mark; marks.right = tape_mark;
    } else if (code.includes("UM-يمين")) {
        marks.top = tape_mark; marks.left = tape_mark; marks.right = tape_mark;
    } else if (code.includes("UM-شمال")) {
        marks.top = tape_mark; marks.right = tape_mark; marks.left = tape_mark;
    } else if (code.includes("UM")) {
        marks.top = tape_mark; marks.left = tape_mark; marks.right = tape_mark;
    } else if (code.includes("CM")) {
        marks.left = tape_mark; marks.top = tape_mark; marks.bottom = tape_mark;
    } else if (code.includes("C")) {
         marks.left = tape_mark; marks.top = tape_mark; marks.bottom = tape_mark;
    } else if (code.includes("LM-يمين")) {
        marks.left = tape_mark; marks.top = tape_mark; marks.right = groove_mark;
    } else if (code.includes("LM-شمال")) {
         marks.right = tape_mark; marks.top = tape_mark; marks.left = groove_mark;
    } else if (code.includes("LM")) {
         marks.left = tape_mark; marks.top = tape_mark;
    } else if (code.includes("L") && !code.includes("LL")) {
         marks.left = tape_mark; marks.top = tape_mark;
    } else if (code.includes("IIM")) {
         marks.left = tape_mark; marks.right = tape_mark; marks.top = groove_mark;
    } else if (code.includes("II")) {
         marks.left = tape_mark; marks.right = tape_mark;
    } else if (code.includes("IM")) {
         marks.left = tape_mark; marks.right = groove_mark;
    } else if (code.includes("I")) {
        marks.left = tape_mark;
    } else if (code.includes("\\\\M")) {
         marks.top = tape_mark; marks.bottom = tape_mark;
    } else if (code.includes("\\\\")) {
         marks.top = tape_mark; marks.bottom = tape_mark;
    } else if (code.includes("\\M")) {
         marks.top = tape_mark; marks.bottom = groove_mark;
    } else if (code.includes("\\")) {
         marks.top = tape_mark;
    }
    
    return marks;
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
  const [isExporting, setIsExporting] = useState(false);

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

  const handleExportExcel = async () => {
    if (!unit) return;
    setIsExporting(true);
    try {
      const unitId = (unit as any).unit_id || unit.id;
      const blob = await unitsApi.exportToExcel(unitId!);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `unit_details_${unitId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'تم التصدير',
        description: 'تم تحميل ملف الإكسل بنجاح',
      });
    } catch {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تصدير الملف',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading || !unit) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
      >
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                <Ruler className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{unit.width_cm} سم</p>
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
                <p className="text-2xl font-bold">{unit.height_cm} سم</p>
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
                <p className="text-2xl font-bold">{unit.depth_cm} سم</p>
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
                <p className="text-2xl font-bold">{(unit as any).shelf_count || unit.shelf_count || 0}</p>
                <p className="text-sm text-muted-foreground">عدد الرفوف</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
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
        <Button
          variant="outline"
          onClick={handleExportExcel}
          disabled={isExporting}
          className="bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700"
        >
          {isExporting ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <FileSpreadsheet className="h-4 w-4" />
          )}
          تصدير إلى Excel
        </Button>
      </motion.div>

      {/* Results Cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cost Estimate */}
        {costEstimate && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent"
          >
            <div className="mb-4 flex items-center gap-3">
               <div className="rounded-xl bg-primary/20 p-2.5 text-primary ring-1 ring-primary/30">
                  <DollarSign className="h-5 w-5" />
               </div>
              <h3 className="font-bold text-lg">تقدير التكلفة</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-background/40 rounded-lg border border-white/5">
                <span className="text-muted-foreground text-sm">تكلفة المواد</span>
                <span className="font-bold font-mono">
                  {costEstimate.cost_breakdown?.['ألواح الخشب']?.toFixed(2) || '0.00'} ج.م
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background/40 rounded-lg border border-white/5">
                <span className="text-muted-foreground text-sm">تكلفة الشريط</span>
                <span className="font-bold font-mono">
                  {costEstimate.cost_breakdown?.['شريط الحافة']?.toFixed(2) || '0.00'} ج.م
                </span>
              </div>
              <div className="border-t border-primary/20 pt-4 mt-2">
                <div className="flex items-center justify-between px-2">
                  <span className="font-bold text-lg">الإجمالي</span>
                  <span className="text-2xl font-bold text-primary font-mono">
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
            className="glass-card p-6 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-accent/20 p-2.5 text-accent ring-1 ring-accent/30">
                 <Grid3X3 className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg">العناصر الداخلية</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-background/40 rounded-lg border border-white/5">
                <span className="text-muted-foreground font-medium">عدد الأدراج (تقريبي)</span>
                {/* Calculate drawers based on parts named 'drawer_box' or similar if explicit count not available */}
                <span className="text-2xl font-bold font-mono">
                    {internalCounter.parts.filter(p => p.type === 'drawer' && p.name.includes('bottom')).length}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-background/40 rounded-lg border border-white/5">
                <span className="text-muted-foreground font-medium">عدد الرفوف</span>
                <span className="text-2xl font-bold font-mono">
                    {internalCounter.parts.filter(p => p.type === 'shelf').reduce((acc, p) => acc + p.qty, 0)}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Edge Breakdown */}
        {edgeBreakdown && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
             className="glass-card p-6 border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-blue-500/20 p-2.5 text-blue-500 ring-1 ring-blue-500/30">
                <Scissors className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg">توزيع الشريط</h3>
            </div>
             <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
              {edgeBreakdown.parts?.map((part, index) => (
                <div key={index} className="flex items-center justify-between text-sm p-2 bg-background/30 rounded-lg hover:bg-background/50 transition-colors">
                  <span className="text-muted-foreground font-medium">{part.part_name}</span>
                  <span className="font-bold font-mono">{part.total_edge_m.toFixed(2)} م</span>
                </div>
              ))}
              </div>
              <div className="border-t border-blue-500/20 pt-3 mt-auto">
                <div className="flex items-center justify-between px-2">
                  <span className="font-bold">الإجمالي</span>
                  <span className="text-xl font-bold text-blue-500 font-mono">
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
        <div className="border-b border-border/50 p-6 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Package className="h-5 w-5" />
            </div>
            <div>
                 <h3 className="font-bold text-lg">قائمة الأجزاء</h3>
                 <p className="text-sm text-muted-foreground">تفاصيل أبعاد وكميات أجزاء الوحدة</p>
            </div>
          </div>
        </div>
        <div className="hidden md:block overflow-x-auto">
          <Table className="w-full text-center">
            <TableHeader className="bg-muted/40 text-xs uppercase tracking-wider">
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="py-4 px-2 text-right font-bold text-muted-foreground w-[15%]">القطعة</TableHead>
                <TableHead className="py-4 px-2 text-center font-bold text-muted-foreground">العرض</TableHead>
                <TableHead className="py-4 px-2 text-center font-bold text-muted-foreground">الارتفاع</TableHead>
                <TableHead className="py-4 px-2 text-center font-bold text-muted-foreground">الكمية</TableHead>
                
                {/* New Columns */}
                <TableHead className="py-4 px-2 text-center font-bold text-muted-foreground bg-yellow-500/10 text-yellow-600">الرمز</TableHead>
                <TableHead className="py-4 px-2 text-center font-bold text-muted-foreground">اعلي</TableHead>
                <TableHead className="py-4 px-2 text-center font-bold text-muted-foreground">شمال</TableHead>
                <TableHead className="py-4 px-2 text-center font-bold text-muted-foreground">اسفل</TableHead>
                <TableHead className="py-4 px-2 text-center font-bold text-muted-foreground">يمين</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border/30 font-medium">
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
                
                const marks = getEdgeMarks((part as any).edge_code || "-");

                return (
                  <TableRow
                    key={i}
                    className="hover:bg-primary/5 transition-colors border-border/30"
                  >
                    <TableCell className="py-4 px-4 font-semibold text-primary text-right">{partTranslations[part.name] || partTranslations[part.name.toLowerCase()] || part.name}</TableCell>
                    <TableCell className="py-4 px-2 font-mono text-muted-foreground">{part.width_cm}</TableCell>
                    <TableCell className="py-4 px-2 font-mono text-muted-foreground">{part.height_cm}</TableCell>
                    <TableCell className="py-4 px-2">
                        <span className="inline-flex items-center justify-center min-w-[2rem] h-6 rounded bg-muted text-xs font-bold">
                        {(part as any).qty || part.qty || 1}
                        </span>
                    </TableCell>
                    
                    {/* New Cells */}
                    <TableCell className="py-4 px-2 font-mono font-bold bg-yellow-500/5 text-yellow-600">{(part as any).edge_code || "-"}</TableCell>
                    <TableCell className="py-4 px-2 font-mono text-xs">{marks.top}</TableCell>
                    <TableCell className="py-4 px-2 font-mono text-xs">{marks.left}</TableCell>
                    <TableCell className="py-4 px-2 font-mono text-xs">{marks.bottom}</TableCell>
                    <TableCell className="py-4 px-2 font-mono text-xs">{marks.right}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            {/* Footer Removed (Area total shown in card above, removed from table for space) */}
          </Table>
        </div>

        {/* Mobile Parts List (Card View) */}
        <div className="md:hidden space-y-4 p-4">
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
            const marks = getEdgeMarks((part as any).edge_code || "-");
            
            return (
              <div key={i} className="flex flex-col gap-2 rounded-xl bg-background/40 border border-white/5 p-4">
                <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">{partTranslations[part.name] || partTranslations[part.name.toLowerCase()] || part.name}</span>
                    <span className="inline-flex items-center justify-center min-w-[2rem] h-6 rounded bg-muted text-xs font-bold">
                       ×{(part as any).qty || part.qty || 1}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                     <span className="text-xs text-muted-foreground">الرمز</span>
                     <span className="font-bold font-mono text-yellow-600 bg-yellow-500/10 px-2 py-0.5 rounded">{(part as any).edge_code || "-"}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground my-1">
                   <div className="flex items-center justify-between bg-muted/20 rounded p-2">
                      <span>العرض</span>
                      <span className="font-mono text-foreground">{part.width_cm}</span>
                   </div>
                   <div className="flex items-center justify-between bg-muted/20 rounded p-2">
                      <span>الارتفاع</span>
                      <span className="font-mono text-foreground">{part.height_cm}</span>
                   </div>
                </div>
                
                {/* Edge Distribution Grid */}
                <div className="grid grid-cols-4 gap-1 text-center text-xs mt-1 bg-muted/10 p-2 rounded border border-white/5">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-muted-foreground">اعلي</span>
                        <span className="font-mono h-4">{marks.top||"-"}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-muted-foreground">شمال</span>
                        <span className="font-mono h-4">{marks.left||"-"}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-muted-foreground">اسفل</span>
                        <span className="font-mono h-4">{marks.bottom||"-"}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-muted-foreground">يمين</span>
                        <span className="font-mono h-4">{marks.right||"-"}</span>
                    </div>
                </div>
              </div>
            );
          })}
           <div className="flex items-center justify-between rounded-xl bg-primary/10 border border-primary/20 p-4 mt-2">
                <span className="font-bold">الإجمالي</span>
                <span className="font-bold text-lg text-primary font-mono">{unit.total_area_m2.toFixed(2)} م²</span>
           </div>
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="grid gap-4 sm:grid-cols-2"
      >
        <div className="glass-card p-6 flex items-center justify-between group hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-3 text-primary ring-1 ring-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Calculator className="h-6 w-6" />
            </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">المساحة الإجمالية</p>
                <p className="text-3xl font-bold font-mono mt-1">{unit.total_area_m2.toFixed(2)} <span className="text-sm text-muted-foreground">م²</span></p>
              </div>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center justify-between group hover:border-accent/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-accent/10 p-3 text-accent ring-1 ring-accent/20 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
              <Scissors className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">إجمالي شريط الحافة</p>
              <p className="text-3xl font-bold font-mono mt-1">{unit.total_edge_band_m.toFixed(2)} <span className="text-sm text-muted-foreground">م</span></p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
