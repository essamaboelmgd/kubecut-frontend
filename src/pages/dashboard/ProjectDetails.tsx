import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Plus, 
  Edit2, 
  Trash2, 
  Layers,
  Calculator,
  Ruler,
  Settings2,
  Loader2,
  FileSpreadsheet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { projectsApi, unitsApi, type Project, type UnitCalculateRequest as CreateUnitData } from '../../lib/api';

// Unit Categories and Types with Arabic Labels
const unitCategories = [
  {
    label: 'وحدات أرضية',
    types: [
      { value: 'ground', label: 'أرضي ضلف' },
      { value: 'sink', label: 'وحدة حوض' },
      { value: 'ground_fixed', label: 'أرضي ثابت' },
      { value: 'sink_fixed', label: 'حوض ثابت' },
      { value: 'drawers', label: 'أدراج (مجرى جنب)' },
      { value: 'drawers_bottom_rail', label: 'أدراج (مجرى سفلي)' },
    ]
  },
  {
    label: 'دواليب (Tall Units)',
    types: [
      { value: 'tall_doors', label: 'دولاب ضلف' },
      { value: 'tall_doors_appliances', label: 'دولاب ضلف وأجهزة' },
      { value: 'tall_drawers_side_doors_top', label: 'دولاب درج جنب + ضلف' },
      { value: 'tall_drawers_bottom_rail_top_doors', label: 'دولاب درج سفلي + ضلف' },
      { value: 'tall_drawers_side_appliances_doors', label: 'دولاب درج جنب + أجهزة' },
      { value: 'tall_drawers_bottom_appliances_doors_top', label: 'دولاب درج سفلي + أجهزة' },
      { value: 'tall_wooden_base', label: 'بلاكار قاعدة خشبية' },
    ]
  },
  {
    label: 'وحدات علوية',
    types: [
      { value: 'wall', label: 'علوي ضلف' },
      { value: 'wall_fixed', label: 'علوي ثابت' },
      { value: 'wall_flip_top_doors_bottom', label: 'علوي قلاب + ضلف' },
      { value: 'wall_microwave', label: 'علوي ميكرويف' },
      { value: 'corner_l_wall', label: 'ركنة L علوي' },
    ]
  },
  {
    label: 'وحدات خاصة (Special)',
    types: [
      { value: 'three_turbo', label: 'وحدة 3 تربو' },
      { value: 'drawer_built_in_oven', label: 'درج + فرن بيلت إن' },
      { value: 'drawer_bottom_rail_built_in_oven', label: 'درج سفلي + فرن بيلت إن' },
      { value: 'two_small_20_one_large_side', label: '2 صغير 20 + 1 كبير (جنب)' },
      { value: 'two_small_20_one_large_bottom', label: '2 صغير 20 + 1 كبير (سفلي)' },
      { value: 'one_small_16_two_large_side', label: '1 صغير 16 + 2 كبير (جنب)' },
      { value: 'one_small_16_two_large_bottom', label: '1 صغير 16 + 2 كبير (سفلي)' },
    ]
  },
];

// Map for quick label lookup
const unitTypeLabels: Record<string, string> = {};
unitCategories.forEach(cat => {
  cat.types.forEach(type => {
    unitTypeLabels[type.value] = type.label;
  });
});

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newUnit, setNewUnit] = useState({
    type: 'ground',
    width_cm: 60, // Changed default to generic 60
    width_2_cm: 0,
    height_cm: 85, // Default ground height
    depth_cm: 56, // Default ground depth
    depth_2_cm: 0,
    shelf_count: 1,
    door_count: 2,
    drawer_count: 0,
    fixed_part_cm: 0,
    oven_height: 60,
    microwave_height: 38,
    vent_height: 30, // Default vent height check
  });

  // Reset/Adjust defaults when type changes
  const handleTypeChange = (type: string) => {
    let defaults = { ...newUnit, type };
    
    // Set sensible defaults based on type category
    if (type.includes('wall')) {
      defaults.height_cm = 70;
      defaults.depth_cm = 32;
    } else if (type.includes('tall')) {
      defaults.height_cm = 220;
      defaults.depth_cm = 58;
    } else {
      // Ground/Sink/Corner Ground
      defaults.height_cm = 85;
      defaults.depth_cm = 56;
    }

    if (type.includes('corner')) {
       defaults.width_cm = 90;
       defaults.width_2_cm = 90; // Default for 90 degree corner
       if (type.includes('corner_45')) {
          defaults.width_cm = 105; // Common for 45 corner
       }
    } else {
        defaults.width_cm = 60;
        defaults.width_2_cm = 0;
    }

    setNewUnit(defaults);
  };

  const isCorner = newUnit.type.includes('corner');
  const isFixed = newUnit.type.includes('fixed');
  const isAppliances = newUnit.type.includes('appliances') || 
                       newUnit.type.includes('microwave') || 
                       newUnit.type.includes('oven') ||
                       newUnit.type.includes('built_in_oven'); // Added checks

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      try {
        const data = await projectsApi.getById(id);
        setProject(data);
      } catch (error) {
        toast({
          title: 'خطأ',
          description: 'فشل تحميل تفاصيل المشروع',
          variant: 'destructive',
        });
        navigate('/dashboard/projects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate, toast]);

  const handleAddUnit = async () => {
    if (!project) return;
    setIsSubmitting(true);
    try {
      const unitData: CreateUnitData = {
        type: newUnit.type as any,
        width_cm: Number(newUnit.width_cm),
        height_cm: Number(newUnit.height_cm),
        depth_cm: Number(newUnit.depth_cm),
        shelf_count: Number(newUnit.shelf_count),
        // Optional fields
        width_2_cm: isCorner ? Number(newUnit.width_2_cm) : 0,
        depth_2_cm: isCorner ? Number(newUnit.depth_2_cm) : 0,
        fixed_part_cm: isFixed ? Number(newUnit.fixed_part_cm) : 0,
        oven_height: isAppliances ? Number(newUnit.oven_height) : 0,
        microwave_height: isAppliances ? Number(newUnit.microwave_height) : 0,
        vent_height: isAppliances ? Number(newUnit.vent_height) : 0,
      };
      
      const savedUnit = await unitsApi.create(unitData);
      
      const unitId = (savedUnit as any).unit_id || savedUnit.unit_id;
      await projectsApi.addUnitToProject(project.project_id, unitId);
      
      const updatedProject = await projectsApi.getById(project.project_id);
      setProject(updatedProject);
      
      setIsAddUnitOpen(false);
      toast({
        title: 'تم إضافة الوحدة',
        description: 'تم إضافة الوحدة بنجاح',
      });
    } catch (error: any) {
      console.error('Error adding unit:', error);
      toast({
        title: 'خطأ',
        description: error.message || 'فشل إضافة الوحدة',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportProject = async () => {
    if (!project) return;
    setIsExporting(true);
    try {
      const blob = await projectsApi.exportProjectToExcel(project.project_id);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `project_${project.name}_units.xlsx`;
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
        description: 'حدث خطأ أثناء تصدير المشروع',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading || !project) {
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
        <div className="mb-6 flex items-center justify-between">
            <Button
            variant="ghost"
            className="group hover:bg-background/20"
            onClick={() => navigate('/dashboard/projects')}
            >
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            العودة للمشاريع
            </Button>
            
            <div className="flex gap-2">
            <Button 
                onClick={handleExportProject} 
                disabled={isExporting}
                className="bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700"
            >
                {isExporting ? (
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                ) : (
                    <FileSpreadsheet className="h-4 w-4 ml-2" />
                )}
                تصدير الكل
            </Button>

            <Button variant="outline" size="sm" className="hover:bg-primary/5 hover:text-primary hover:border-primary/20">
                <Edit2 className="h-4 w-4 ml-2" />
                تعديل
            </Button>
            <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 hover:border-destructive/20">
                <Trash2 className="h-4 w-4 ml-2" />
                حذف
            </Button>
            </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 border border-white/10 shadow-2xl">
           <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
             <Layers className="h-64 w-64 text-primary" />
           </div>
           
           <div className="relative z-10">
                <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20 mb-4">
                  <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  قيد العمل
                </div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">{project.name}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <span className="font-semibold text-foreground/80">{project.client_name}</span>
                    <span>•</span>
                    <span>تم التحديث {new Date(project.updated_at || project.created_at).toLocaleDateString('ar-EG')}</span>
                </div>
                <p className="max-w-2xl text-lg text-muted-foreground/90 leading-relaxed">
                    {project.description || 'لا يوجد وصف للمشروع'}
                </p>
           </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="grid gap-6 sm:grid-cols-3"
      >
        {[
            {
                label: 'عدد الوحدات',
                value: project.units.length,
                unit: 'وحدة',
                icon: Layers,
                color: 'text-blue-500',
                bg: 'bg-blue-500/10'
            },
            {
                label: 'المساحة الإجمالية',
                value: project.units.reduce((acc, u) => acc + u.total_area_m2, 0).toFixed(1),
                unit: 'م²',
                icon: Ruler,
                color: 'text-emerald-500',
                bg: 'bg-emerald-500/10'
            },
            {
                label: 'شريط الحافة',
                value: project.units.reduce((acc, u) => acc + u.total_edge_band_m, 0).toFixed(1),
                unit: 'م',
                icon: Calculator,
                color: 'text-amber-500',
                bg: 'bg-amber-500/10'
            }
        ].map((stat, idx) => (
             <div key={idx} className="glass-card p-6 flex items-center justify-between hover:scale-[1.02] transition-transform duration-300">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold tracking-tight">
                    {stat.value} <span className="text-lg text-muted-foreground/60 font-medium">{stat.unit}</span>
                  </p>
                </div>
                <div className={`rounded-2xl p-4 ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
             </div>
        ))}
      </motion.div>

      {/* Units */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">الوحدات</h2>
          <Dialog open={isAddUnitOpen} onOpenChange={setIsAddUnitOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" size="sm">
                <Plus className="h-4 w-4" />
                إنشاء وحدة جديدة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>إنشاء وحدة جديدة</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                {/* Unit Type Selection */}
                <div className="space-y-2">
                  <Label>نوع الوحدة</Label>
                  <Select
                    value={newUnit.type}
                    onValueChange={handleTypeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع الوحدة" />
                    </SelectTrigger>
                    <SelectContent>
                      {unitCategories.map((category, index) => (
                        <SelectGroup key={category.label}>
                          {index > 0 && <div className="my-1 h-px bg-secondary/50 mx-1" />}
                          <SelectLabel className="bg-muted/50 px-2 py-1.5 text-xs font-bold text-primary">
                            {category.label}
                          </SelectLabel>
                          {category.types.map((type) => (
                            <SelectItem key={type.value} value={type.value} className="pl-6">
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Dimensions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>{isCorner ? 'العرض 1 (سم)' : 'العرض (سم)'}</Label>
                    <Input
                      type="number"
                      value={newUnit.width_cm}
                      onChange={(e) => setNewUnit({ ...newUnit, width_cm: Number(e.target.value) })}
                    />
                  </div>
                  
                  {isCorner && (
                     <div className="space-y-2">
                      <Label>العرض 2 (سم)</Label>
                      <Input
                        type="number"
                        value={newUnit.width_2_cm}
                        onChange={(e) => setNewUnit({ ...newUnit, width_2_cm: Number(e.target.value) })}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>الارتفاع (سم)</Label>
                    <Input
                      type="number"
                      value={newUnit.height_cm}
                      onChange={(e) => setNewUnit({ ...newUnit, height_cm: Number(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{isCorner ? 'العمق 1 (سم)' : 'العمق (سم)'}</Label>
                    <Input
                      type="number"
                      value={newUnit.depth_cm}
                      onChange={(e) => setNewUnit({ ...newUnit, depth_cm: Number(e.target.value) })}
                    />
                  </div>

                  {isCorner && (
                    <div className="space-y-2">
                      <Label>العمق 2 (سم) - اختياري</Label>
                      <Input
                        type="number"
                        value={newUnit.depth_2_cm}
                        onChange={(e) => setNewUnit({ ...newUnit, depth_2_cm: Number(e.target.value) })}
                      />
                    </div>
                  )}

                  {isFixed && (
                    <div className="space-y-2">
                      <Label>الجزء الثابت (سم)</Label>
                      <Input
                        type="number"
                        value={newUnit.fixed_part_cm}
                        onChange={(e) => setNewUnit({ ...newUnit, fixed_part_cm: Number(e.target.value) })}
                      />
                    </div>
                  )}
                </div>

                {/* Appliances */}
                {isAppliances && (
                   <div className="grid grid-cols-2 gap-4 border-t pt-4">
                      {(newUnit.type.includes('oven') || newUnit.type.includes('appliances') || newUnit.type.includes('built_in_oven')) && (
                         <div className="space-y-2">
                          <Label>ارتفاع الفرن (سم)</Label>
                          <Input
                            type="number"
                            value={newUnit.oven_height}
                            onChange={(e) => setNewUnit({ ...newUnit, oven_height: Number(e.target.value) })}
                          />
                        </div>
                      )}
                      
                      {(newUnit.type.includes('microwave') || newUnit.type.includes('appliances')) && (
                         <div className="space-y-2">
                          <Label>ارتفاع الميكرويف (سم)</Label>
                          <Input
                            type="number"
                            value={newUnit.microwave_height}
                            onChange={(e) => setNewUnit({ ...newUnit, microwave_height: Number(e.target.value) })}
                          />
                        </div>
                      )}

                      {(newUnit.type.includes('appliances')) && (
                         <div className="space-y-2">
                          <Label>ارتفاع الشفاط (سم)</Label>
                          <Input
                            type="number"
                            value={newUnit.vent_height}
                            onChange={(e) => setNewUnit({ ...newUnit, vent_height: Number(e.target.value) })}
                          />
                        </div>
                      )}
                   </div>
                )}

                {/* Basic Options */}
                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                   <div className="space-y-2">
                    <Label>عدد الرفوف</Label>
                    <Input
                      type="number"
                      value={newUnit.shelf_count}
                      onChange={(e) => setNewUnit({ ...newUnit, shelf_count: Number(e.target.value) })}
                    />
                  </div>

                  {/* Door Count - Hide for pure drawer/special units */}
                  {(!['drawers_unit', 'drawers_bottom_rail_unit', 'three_turbo', 'drawer_built_in_oven', 'drawer_bottom_rail_built_in_oven'].includes(newUnit.type) && !newUnit.type.startsWith('two_small') && !newUnit.type.startsWith('one_small')) && (
                     <div className="space-y-2">
                      <Label>عدد الضلف</Label>
                      <Input
                        type="number"
                        value={newUnit.door_count}
                        onChange={(e) => setNewUnit({ ...newUnit, door_count: Number(e.target.value) })}
                      />
                    </div>
                  )}

                  {/* Drawer Count - Show for units with variable drawers */}
                  {(newUnit.type.includes('drawers')) && (
                     <div className="space-y-2">
                      <Label>عدد الأدراج</Label>
                      <Input
                        type="number"
                        value={newUnit.drawer_count}
                        onChange={(e) => setNewUnit({ ...newUnit, drawer_count: Number(e.target.value) })}
                      />
                    </div>
                  )}
                </div>

              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setIsAddUnitOpen(false)} disabled={isSubmitting}>
                  إلغاء
                </Button>
                <Button variant="hero" className="flex-1" onClick={handleAddUnit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      جاري الإنشاء...
                    </>
                  ) : (
                    'إنشاء الوحدة'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {project.units.map((unit, index) => (
            <motion.div
              key={unit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
            >
              <Link
                to={`/dashboard/units/${unit.id}`}
                className="glass-card group relative block overflow-hidden p-6 transition-all duration-300 hover:shadow-glow hover:-translate-y-1"
              >
                 <div className="mb-4 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/80 text-secondary-foreground shadow-sm">
                        <Layers className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                            {unitTypeLabels[unit.type] || unit.type}
                        </h4>
                        <span className="text-xs text-muted-foreground font-mono">
                            {unit.width_cm} × {unit.height_cm} × {unit.depth_cm}
                        </span>
                      </div>
                   </div>
                   <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                     <Settings2 className="h-4 w-4" />
                   </Button>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/50">
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span>مس: {unit.total_area_m2?.toFixed(2) || '0.00'} م²</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        <span>حافة: {unit.total_edge_band_m?.toFixed(2) || '0.00'} م</span>
                    </div>
                 </div>
                 
                 {/* Decorative Corner */}
                 <div className="absolute top-0 left-0 h-16 w-16 bg-gradient-to-br from-primary/10 to-transparent -translate-x-8 -translate-y-8 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out" />
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
