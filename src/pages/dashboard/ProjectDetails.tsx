import { useState } from 'react';
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
  Settings2
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
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Project, Unit } from '@/lib/api';

// Mock data
const mockProject: Project = {
  id: '1',
  name: 'مطبخ فيلا المعادي',
  client: 'أحمد محمد',
  description: 'مطبخ فاخر على شكل حرف U مع جزيرة',
  units_count: 3,
  created_at: '2024-01-15',
  updated_at: '2024-01-20',
};

const mockUnits: Unit[] = [
  {
    id: '1',
    type: 'ground',
    width: 600,
    height: 850,
    depth: 560,
    shelves_count: 2,
    parts: [],
    total_area: 2.4,
    total_edge_length: 12.5,
  },
  {
    id: '2',
    type: 'wall',
    width: 800,
    height: 700,
    depth: 350,
    shelves_count: 2,
    parts: [],
    total_area: 1.8,
    total_edge_length: 10.2,
  },
];

const unitTypeLabels: Record<string, string> = {
  ground: 'وحدة أرضية',
  wall: 'وحدة حائطية',
  double_door: 'وحدة بابين',
  sink_ground: 'وحدة حوض',
};

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project] = useState<Project>(mockProject);
  const [units] = useState<Unit[]>(mockUnits);
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false);
  const [newUnit, setNewUnit] = useState({
    type: 'ground' as const,
    width: 600,
    height: 850,
    depth: 560,
    shelves_count: 2,
  });

  const handleAddUnit = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast({
        title: 'تم الإضافة',
        description: 'تم إضافة الوحدة بنجاح',
      });
      setIsAddUnitOpen(false);
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إضافة الوحدة',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/dashboard/projects')}
        >
          <ArrowRight className="h-4 w-4" />
          العودة للمشاريع
        </Button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">{project.name}</h1>
            <p className="mt-1 text-muted-foreground">{project.client}</p>
            <p className="mt-2 text-sm text-muted-foreground">{project.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit2 className="h-4 w-4" />
              تعديل
            </Button>
            <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
              حذف
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="grid gap-4 sm:grid-cols-3"
      >
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{units.length}</p>
              <p className="text-sm text-muted-foreground">وحدة</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-accent/10 p-2.5 text-accent">
              <Ruler className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {units.reduce((acc, u) => acc + u.total_area, 0).toFixed(1)} م²
              </p>
              <p className="text-sm text-muted-foreground">المساحة الإجمالية</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {units.reduce((acc, u) => acc + u.total_edge_length, 0).toFixed(1)} م
              </p>
              <p className="text-sm text-muted-foreground">شريط الحافة</p>
            </div>
          </div>
        </div>
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
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>إنشاء وحدة جديدة</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>النوع</Label>
                  <Select
                    value={newUnit.type}
                    onValueChange={(v) => setNewUnit({ ...newUnit, type: v as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ground">وحدة أرضية</SelectItem>
                      <SelectItem value="wall">وحدة حائطية</SelectItem>
                      <SelectItem value="double_door">وحدة بابين</SelectItem>
                      <SelectItem value="sink_ground">وحدة حوض</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>العرض (مم)</Label>
                    <Input
                      type="number"
                      value={newUnit.width}
                      onChange={(e) => setNewUnit({ ...newUnit, width: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>الارتفاع (مم)</Label>
                    <Input
                      type="number"
                      value={newUnit.height}
                      onChange={(e) => setNewUnit({ ...newUnit, height: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>العمق (مم)</Label>
                    <Input
                      type="number"
                      value={newUnit.depth}
                      onChange={(e) => setNewUnit({ ...newUnit, depth: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>عدد الرفوف</Label>
                  <Input
                    type="number"
                    value={newUnit.shelves_count}
                    onChange={(e) => setNewUnit({ ...newUnit, shelves_count: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setIsAddUnitOpen(false)}>
                  إلغاء
                </Button>
                <Button variant="hero" className="flex-1" onClick={handleAddUnit}>
                  إنشاء الوحدة
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {units.map((unit, index) => (
            <motion.div
              key={unit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
            >
              <Link
                to={`/dashboard/units/${unit.id}`}
                className="glass-card group block p-5 transition-all hover:border-primary/30 hover-lift"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {unitTypeLabels[unit.type]}
                  </span>
                  <Settings2 className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mb-4 grid grid-cols-3 gap-2 text-center text-sm">
                  <div>
                    <p className="font-semibold">{unit.width}</p>
                    <p className="text-xs text-muted-foreground">عرض</p>
                  </div>
                  <div>
                    <p className="font-semibold">{unit.height}</p>
                    <p className="text-xs text-muted-foreground">ارتفاع</p>
                  </div>
                  <div>
                    <p className="font-semibold">{unit.depth}</p>
                    <p className="text-xs text-muted-foreground">عمق</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                  <span>{unit.total_area} م²</span>
                  <span>{unit.total_edge_length} م شريط</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
