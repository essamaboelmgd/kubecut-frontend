import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { settingsApi, type SettingsModel } from '@/lib/api';

const assemblyMethods = {
  full_sides_back_routed: 'جانبين كاملين (ظهر مفحار)',
  // full_base_back_routed: 'أرضية كاملة (ظهر مفحار)',
  base_full_top_sides_back_routed: 'قاعدة كاملة + علوي جانبين (ظهر مفحار)',
  // full_sides_back_flush: 'جانبين كاملين (ظهر لطش)',
  // full_base_back_flush: 'أرضية كاملة (ظهر لطش)',
  // base_full_top_sides_back_flush: 'قاعدة كاملة + علوي جانبين (ظهر لطش)',
};

const handleTypes = {
  built_in: 'مقبض بيلت ان',
  regular: 'مقبض عادي',
  hidden_cl_chassis: 'مقبض ارضي (C/L) علوي شاسية',
  hidden_cl_drop: 'مقبض ارضي (C/L) علوي ساقط',
};

// Edge Banding Options
const edgeBandingOptions = {
  "-": "بدون",
  "I": "I : شريط طول",
  "L": "L : شريط ( طول + عرض )",
  "LM-يمين": "L-M : شريط ( طول + عرض ) مفحار يمين",
  "C": "C : شريط ( طول + 2 عرض )",
  "U": "U : شريط ( 2 طول + عرض )",
  "O": "O : شريط داير",
  "\\": "\\ : شريط عرض",
  "II": "II : شريط 2 طول",
  "\\\\": "\\\\ : شريط 2 عرض",
  "IM": "IM : شريط طول + مفحار عكس",
  "CM": "CM : شريط ( طول + 2 عرض ) + مفحار عكس",
  "UM-يمين": "UM-R : شريط ( 2 طول + عرض ) + مفحار يمين",
  "IIM": "IIM : شريط 2 طول + مفحار مع الطول",
  "\\M": "\\M : شريط عرض + مفحار عكس",
  "\\\\M": "\\\\M : شريط 2 عرض + مفحار مع العرض",
  "OM": "OM : شريط داير + مفحار مع الطول",
  "DR": "DR : شريط طول + مفحار درج بلوم",
  "LL": "LL : وحدة زاوية حرف L",
  "LS": "LS : وحدة ركنة مشطوفة",
  "LLM": "LLM : وحدة زاوية حرف L + مفحار",
  "LSM": "LSM : وحدة ركنة مشطوفة + مفحار",
};

// Part Labels
const PART_LABELS: Record<keyof import('@/lib/api').PartEdgeSettings, string> = {
  base_lower: "قاعدة الوحدة السفلية",
  base_upper: "قاعدة و برنيطة العلوية",
  front_mirror: "مرايه امامية",
  back_mirror: "مرايه خلفية",
  sides_ground: "جانبين ارضي",
  sides_upper: "جانبين علوي",
  doors: "ضلف",
  exposed_panel: "الجنب العيرة",
  shelf: "رف",
  drawer_width: "عرض الدرج",
  drawer_depth: "عمق الدرج",
};

export default function CuttingSettings() {
  const [settings, setSettings] = useState<SettingsModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const data = await settingsApi.get();
      // Initialize part_edge_settings if missing
      if (!data.part_edge_settings) {
        data.part_edge_settings = {
          base_lower: '-',
          base_upper: '-',
          front_mirror: '-',
          back_mirror: '-',
          sides_ground: '-',
          sides_upper: '-',
          doors: '-',
          exposed_panel: '-',
          shelf: '-',
          drawer_width: '-',
          drawer_depth: '-',
        };
      }
      setSettings(data);
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل تحميل الإعدادات',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };



  const handleInputChange = (key: keyof SettingsModel, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  const handleNumericChange = (key: keyof SettingsModel, value: string) => {
    if (!settings) return;
    // If empty or invalid number, default to 0. Enforce non-negative.
    let numValue = value === '' ? 0 : parseFloat(value);
    if (isNaN(numValue)) numValue = 0;
    if (numValue < 0) numValue = 0;

    setSettings({ ...settings, [key]: numValue });
  };

  const handlePartEdgeChange = (partKey: keyof import('@/lib/api').PartEdgeSettings, value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      part_edge_settings: {
        ...settings.part_edge_settings,
        [partKey]: value
      }
    });
  };

  const handleMaterialChange = (materialKey: string, field: keyof import('@/lib/api').MaterialInfo, value: string) => {
    if (!settings) return;
    const numValue = value === '' ? 0 : parseFloat(value);

    const currentMaterials = settings.materials || {};
    const currentMaterial = currentMaterials[materialKey] || {};

    setSettings({
      ...settings,
      materials: {
        ...currentMaterials,
        [materialKey]: {
          ...currentMaterial,
          [field]: isNaN(numValue) ? 0 : numValue
        }
      }
    });
  };

  const handleSave = async () => {
    if (!settings) return;
    try {
      setIsSaving(true);
      await settingsApi.update(settings);
      toast({
        title: 'تم الحفظ',
        description: 'تم تحديث الإعدادات بنجاح',
      });
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.detail || error.message || 'فشل حفظ الإعدادات';
      toast({
        title: 'خطأ',
        description: typeof msg === 'string' ? msg : 'فشل حفظ الإعدادات',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to safely display numeric values (avoid NaN)
  const getSafeValue = (val: any) => {
    return (val === undefined || val === null || isNaN(val)) ? '' : val;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">إعدادات التقطيع</h1>
            <p className="mt-1 text-muted-foreground">
              تخصيص طريقة الحساب والهدر وأسعار الخامات
            </p>
          </div>
          <Button onClick={handleSave} disabled={isSaving} variant="hero">
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            حفظ التغييرات
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Assembly Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card className="glass-card h-full border-primary/10">
            <CardHeader className="pb-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2.5 text-primary ring-1 ring-primary/20">
                  <Settings2 className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">طريقة التجميع</CardTitle>
                  <CardDescription>
                    تحديد كيفية تجميع الوحدات والمقابض
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">نظام التجميع</Label>
                <Select
                  value={settings.assembly_method}
                  onValueChange={(value) => handleInputChange('assembly_method', value)}
                >
                  <SelectTrigger className="h-11 bg-background/50 focus:ring-primary/20 transition-all">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(assemblyMethods).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>



              <div className="space-y-2">
                <Label className="text-sm font-medium">نوع المقبض</Label>
                <Select
                  value={settings.handle_type}
                  onValueChange={(value) => handleInputChange('handle_type', value)}
                >
                  <SelectTrigger className="h-11 bg-background/50 focus:ring-primary/20 transition-all">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(handleTypes).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">ارتفاع قطاع المقبض - C/L</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={getSafeValue(settings.handle_profile_height)}
                      onChange={(e) => handleNumericChange('handle_profile_height', e.target.value)}
                      className="h-11 pr-3 bg-background/50"
                      placeholder="0"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">سم</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">سقوط الضلفة - قطاع الشاسيه</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={getSafeValue(settings.chassis_handle_drop)}
                      onChange={(e) => handleNumericChange('chassis_handle_drop', e.target.value)}
                      className="h-11 pr-3 bg-background/50"
                      placeholder="0"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">سم</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dimensions & Deductions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="glass-card h-full border-accent/10">
            <CardHeader className="pb-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-accent/10 p-2.5 text-accent ring-1 ring-accent/20">
                  <Settings2 className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">الأبعاد والخصومات</CardTitle>
                  <CardDescription>
                    تحديد سمك الخامات وقيم الخصم المختلفة
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2 pt-6">
              {[
                { label: 'سمك الكونتر', key: 'counter_thickness' },
                { label: 'عرض المرآة', key: 'mirror_width' },
                { label: 'خصم الظهر', key: 'back_deduction' },
                { label: 'خصم الرف من العمق', key: 'shelf_depth_deduction' },
                { label: 'خصم عرض الضلفة', key: 'door_width_deduction_no_edge' },
                { label: 'خصم ارتفاع ضلفة أرضي', key: 'ground_door_height_deduction_no_edge' },
                { label: 'سعر متر الزجاج', key: 'glass_price_m2' },
              ].map((item) => (
                <div key={item.key} className="space-y-2">
                  <Label className="text-sm font-medium">{item.label}</Label>
                  <div className="relative group">
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={getSafeValue((settings as any)[item.key])}
                      onChange={(e) => handleNumericChange(item.key as keyof SettingsModel, e.target.value)}
                      className="h-11 pr-3 bg-background/50 focus:bg-background transition-colors"
                      placeholder="0"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                      {item.key === 'glass_price_m2' ? 'ج.م' : 'سم'}
                    </span>
                  </div>
                </div>
              ))}

              <div className="space-y-2">
                <Label className="text-sm font-medium">سعر لوح الخشب (الكونتر)</Label>
                <div className="relative group">
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    value={getSafeValue(settings?.materials?.['plywood_sheet']?.price_per_sheet)}
                    onChange={(e) => handleMaterialChange('plywood_sheet', 'price_per_sheet', e.target.value)}
                    className="h-11 pr-3 bg-background/50 focus:bg-background transition-colors"
                    placeholder="0"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground group-hover:text-foreground transition-colors">ج.م</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="md:col-span-2"
        >
          <Card className="glass-card border-white/5">
            <CardHeader className="pb-4 border-b border-border/40">
              <CardTitle className="text-lg font-bold">أكواد التقطيع</CardTitle>
              <CardDescription>
                تخصيص الرموز المستخدمة في تقارير القص (3 أكواد موحدة للضلف والشاسيه)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">كود أساسي</Label>
                  <Input
                    value={settings.code_basic || ''}
                    onChange={(e) => handleInputChange('code_basic', e.target.value)}
                    className="h-11 bg-background/50 focus:bg-background transition-colors"
                    placeholder="مثال: Basic"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">كود إضافي 1</Label>
                  <Input
                    value={settings.code_add_1 || ''}
                    onChange={(e) => handleInputChange('code_add_1', e.target.value)}
                    className="h-11 bg-background/50 focus:bg-background transition-colors"
                    placeholder="مثال: Add 1"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">كود إضافي 2</Label>
                  <Input
                    value={settings.code_add_2 || ''}
                    onChange={(e) => handleInputChange('code_add_2', e.target.value)}
                    className="h-11 bg-background/50 focus:bg-background transition-colors"
                    placeholder="مثال: Add 2"
                  />
                </div>
              </div>

              <div className="border-t border-border/40 pt-4">
                <p className="text-sm text-muted-foreground mb-3">كود الشريط الأمامي للوحدة</p>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">كود شريط أمامي أساسي</Label>
                    <Input
                      value={settings.front_edge_basic || ''}
                      onChange={(e) => handleInputChange('front_edge_basic', e.target.value)}
                      className="h-11 bg-background/50 focus:bg-background transition-colors"
                      placeholder="مثال: أبيض"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">كود شريط أمامي إضافي</Label>
                    <Input
                      value={settings.front_edge_add || ''}
                      onChange={(e) => handleInputChange('front_edge_add', e.target.value)}
                      className="h-11 bg-background/50 focus:bg-background transition-colors"
                      placeholder="مثال: بني"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Router Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="md:col-span-2"
        >
          <Card className="glass-card border-white/5">
            <CardHeader className="pb-4 border-b border-border/40">
              <CardTitle className="text-lg font-bold">إعدادات المفحار</CardTitle>
              <CardDescription>
                تحديد أبعاد ومسافات المفحار
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-3 pt-6">
              {[
                { label: 'عمق المفحار', key: 'router_depth' },
                { label: 'بعد المفحار', key: 'router_distance' },
                { label: 'سمك المفحار', key: 'router_thickness' },
              ].map(item => (
                <div key={item.key} className="space-y-2">
                  <Label className="text-sm font-medium">{item.label}</Label>
                  <div className="relative group">
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={getSafeValue((settings as any)[item.key])}
                      onChange={(e) => handleNumericChange(item.key as keyof SettingsModel, e.target.value)}
                      className="h-11 pr-3 bg-background/50 focus:bg-background transition-colors"
                      placeholder="0"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground group-hover:text-foreground transition-colors">سم</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Part Edge Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="md:col-span-2"
        >
          <Card className="glass-card border-white/5">
            <CardHeader className="pb-4 border-b border-border/40">
              <CardTitle className="text-lg font-bold">لصق الشريط والمفحار</CardTitle>
              <CardDescription>
                تحديد نوع الشريط والمفحار لكل جزء من الوحدة
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="rounded-md border border-border/40 overflow-hidden">
                <div className="rounded-md border border-border/40 overflow-hidden">
                  {/* Header - Hidden on mobile, shown on tablet/desktop */}
                  <div className="hidden sm:grid sm:grid-cols-2 bg-muted/50 p-4 border-b border-border/40 font-medium text-muted-foreground">
                    <div>اسم الجزء</div>
                    <div>رمز الشريط والمفحار</div>
                  </div>

                  <div className="divide-y divide-border/40">
                    {Object.entries(PART_LABELS).map(([key, label]) => (
                      <div key={key} className="flex flex-col sm:grid sm:grid-cols-2 gap-2 sm:gap-4 p-4 hover:bg-muted/20 transition-colors sm:items-center">
                        <div className="font-medium text-foreground">{label}</div>
                        <div className="w-full">
                          <Select
                            value={settings?.part_edge_settings?.[key as keyof import('@/lib/api').PartEdgeSettings] || '-'}
                            onValueChange={(value) => handlePartEdgeChange(key as keyof import('@/lib/api').PartEdgeSettings, value)}
                          >
                            <SelectTrigger className="w-full bg-background/50 h-11 sm:h-10">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              {Object.entries(edgeBandingOptions).map(([optKey, optLabel]) => (
                                <SelectItem key={optKey} value={optKey}>
                                  <span className="flex items-center gap-2">
                                    <span className="font-mono font-bold bg-muted px-1.5 py-0.5 rounded text-xs min-w-[30px] text-center">{optKey}</span>
                                    <span className="text-muted-foreground text-xs truncate">{optLabel.split(' : ')[1] || optLabel}</span>
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Board Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="md:col-span-2"
        >
          <Card className="glass-card border-white/5">
            <CardHeader className="pb-4 border-b border-border/40">
              <CardTitle className="text-lg font-bold">إعدادات الألواح</CardTitle>
              <CardDescription>
                تحديد أبعاد وتكاليف كل نوع لوح
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="rounded-md border border-border/40 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border/40">
                      <th className="p-3 text-right font-medium text-muted-foreground">اللوح</th>
                      <th className="p-3 text-center font-medium text-muted-foreground">العرض (سم)</th>
                      <th className="p-3 text-center font-medium text-muted-foreground">الطول (سم)</th>
                      <th className="p-3 text-center font-medium text-muted-foreground">تكلفة التقطيع</th>
                      <th className="p-3 text-center font-medium text-muted-foreground">تكلفة متر الشريط</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {([
                      { key: 'board_chassis', label: 'الشاسية' },
                      { key: 'board_basic', label: 'كود أساسي' },
                      { key: 'board_add1', label: 'كود اضافي 1' },
                      { key: 'board_add2', label: 'كود اضافي 2' },
                      { key: 'board_back', label: 'ظهر' },
                      { key: 'board_back_basic', label: 'ظهر أساسي' },
                      { key: 'board_back_add', label: 'ظهر اضافي' },
                    ] as const).map(board => {
                      const boardData = (settings as any)?.[board.key] || { width_cm: 0, height_cm: 0, cutting_cost: 0, edge_band_cost_per_meter: 0 };
                      const updateBoard = (field: string, value: string) => {
                        if (!settings) return;
                        const numVal = value === '' ? 0 : parseFloat(value);
                        setSettings({
                          ...settings,
                          [board.key]: { ...boardData, [field]: isNaN(numVal) ? 0 : numVal }
                        });
                      };
                      return (
                        <tr key={board.key} className="hover:bg-muted/20 transition-colors">
                          <td className="p-3 font-medium">{board.label}</td>
                          {(['width_cm', 'height_cm', 'cutting_cost', 'edge_band_cost_per_meter'] as const).map(field => (
                            <td key={field} className="p-2">
                              <Input
                                type="number"
                                min="0"
                                step="0.1"
                                value={boardData[field] || ''}
                                onChange={(e) => updateBoard(field, e.target.value)}
                                className="h-9 text-center bg-background/50"
                                placeholder="0"
                              />
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Accessory Prices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Card className="glass-card border-white/5">
            <CardHeader className="pb-4 border-b border-border/40">
              <CardTitle className="text-lg font-bold">أسعار الإكسسوارات</CardTitle>
              <CardDescription>
                تحديد سعر كل إكسسوار
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="rounded-md border border-border/40 overflow-hidden">
                <div className="hidden sm:grid sm:grid-cols-2 bg-muted/50 p-3 border-b border-border/40 font-medium text-muted-foreground text-sm">
                  <div>الإكسسوار</div>
                  <div>السعر</div>
                </div>
                <div className="divide-y divide-border/40">
                  {([
                    { key: 'straight_hinge', label: 'مفصلات عدلة' },
                    { key: 'side_drawer_slide', label: 'مجر درج جانبية' },
                    { key: 'bottom_drawer_slide', label: 'مجر درج سفلية' },
                    { key: 'flip_arm', label: 'دراع قلاب' },
                    { key: 'spider_hinge', label: 'مفصلة عقربة' },
                    { key: 'blind_corner_hinge', label: 'مفصلة بلايند كورنر' },
                    { key: 'shelf_support', label: 'تكاية رف' },
                    { key: 'leg_set', label: 'طقم رجل' },
                    { key: 'kitchen_hanger', label: 'علاقة مطبخ' },
                    { key: 'regular_handle', label: 'مقبض عادي' },
                    { key: 'dressing_angle', label: 'زاوية دريسنج' },
                    { key: 'socle_angle', label: 'زاوية سوكلو' },
                  ] as const).map(acc => {
                    const accPrices = settings?.accessory_prices || {} as any;
                    return (
                      <div key={acc.key} className="flex flex-col sm:grid sm:grid-cols-2 gap-2 sm:gap-4 p-3 hover:bg-muted/20 transition-colors sm:items-center">
                        <div className="font-medium text-sm">{acc.label}</div>
                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          value={(accPrices as any)[acc.key] || ''}
                          onChange={(e) => {
                            if (!settings) return;
                            const numVal = e.target.value === '' ? 0 : parseFloat(e.target.value);
                            setSettings({
                              ...settings,
                              accessory_prices: {
                                ...accPrices,
                                [acc.key]: isNaN(numVal) ? 0 : numVal
                              } as any
                            });
                          }}
                          className="h-9 bg-background/50"
                          placeholder="0"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bar Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Card className="glass-card border-white/5">
            <CardHeader className="pb-4 border-b border-border/40">
              <CardTitle className="text-lg font-bold">أسعار الأعواد</CardTitle>
              <CardDescription>
                تحديد مقاس وسعر كل عود
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="rounded-md border border-border/40 overflow-hidden">
                <div className="hidden sm:grid sm:grid-cols-3 bg-muted/50 p-3 border-b border-border/40 font-medium text-muted-foreground text-sm">
                  <div>العود</div>
                  <div>المقاس (سم)</div>
                  <div>السعر</div>
                </div>
                <div className="divide-y divide-border/40">
                  {([
                    { key: 'bar_built_in_handle', label: 'مقبض بيلت ان' },
                    { key: 'bar_glass_profile', label: 'قطاع زجاج' },
                    { key: 'bar_socle', label: 'عود سوكلو' },
                  ] as const).map(bar => {
                    const barData = (settings as any)?.[bar.key] || { size_cm: 0, price: 0 };
                    const updateBar = (field: string, value: string) => {
                      if (!settings) return;
                      const numVal = value === '' ? 0 : parseFloat(value);
                      setSettings({
                        ...settings,
                        [bar.key]: { ...barData, [field]: isNaN(numVal) ? 0 : numVal }
                      });
                    };
                    return (
                      <div key={bar.key} className="flex flex-col sm:grid sm:grid-cols-3 gap-2 sm:gap-4 p-3 hover:bg-muted/20 transition-colors sm:items-center">
                        <div className="font-medium text-sm">{bar.label}</div>
                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          value={barData.size_cm || ''}
                          onChange={(e) => updateBar('size_cm', e.target.value)}
                          className="h-9 bg-background/50"
                          placeholder="0"
                        />
                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          value={barData.price || ''}
                          onChange={(e) => updateBar('price', e.target.value)}
                          className="h-9 bg-background/50"
                          placeholder="0"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
