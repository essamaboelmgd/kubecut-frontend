import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import type { Settings } from '@/lib/api';

const defaultSettings: Settings = {
  assembly_method: 'screws',
  handle_type: 'bar',
  handle_recess_height_mm: 30,
  default_board_thickness_mm: 18,
  back_panel_thickness_mm: 4,
  edge_overlap_mm: 1,
  back_clearance_mm: 3,
  top_clearance_mm: 2,
  bottom_clearance_mm: 2,
  side_overlap_mm: 2,
  sheet_size_m2: 2.88,
  materials: {
    plywood_sheet_price: 850,
    edge_band_price: 15,
  },
};

export default function CuttingSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: 'تم الحفظ',
        description: 'تم حفظ إعدادات التقطيع بنجاح',
      });
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء حفظ الإعدادات',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold md:text-3xl">إعدادات التقطيع</h1>
        <p className="mt-1 text-muted-foreground">
          خصص معايير وإعدادات التقطيع الخاصة بك
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="grid gap-6 lg:grid-cols-2"
      >
        {/* Assembly & Handles */}
        <div className="glass-card p-6">
          <h2 className="mb-6 text-lg font-semibold">التجميع والمقابض</h2>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>طريقة التجميع</Label>
              <Select
                value={settings.assembly_method}
                onValueChange={(v) => updateSetting('assembly_method', v as Settings['assembly_method'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lamello">لاميلو</SelectItem>
                  <SelectItem value="screws">مسامير</SelectItem>
                  <SelectItem value="dowels">خوابير</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>نوع المقبض</Label>
              <Select
                value={settings.handle_type}
                onValueChange={(v) => updateSetting('handle_type', v as Settings['handle_type'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="knob">مقبض دائري</SelectItem>
                  <SelectItem value="bar">مقبض طولي</SelectItem>
                  <SelectItem value="hidden">مخفي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>ارتفاع تجويف المقبض (مم)</Label>
              <Input
                type="number"
                value={settings.handle_recess_height_mm}
                onChange={(e) => updateSetting('handle_recess_height_mm', Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Board Thickness */}
        <div className="glass-card p-6">
          <h2 className="mb-6 text-lg font-semibold">سمك الألواح</h2>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>سمك اللوح الافتراضي (مم)</Label>
              <Input
                type="number"
                value={settings.default_board_thickness_mm}
                onChange={(e) => updateSetting('default_board_thickness_mm', Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label>سمك اللوح الخلفي (مم)</Label>
              <Input
                type="number"
                value={settings.back_panel_thickness_mm}
                onChange={(e) => updateSetting('back_panel_thickness_mm', Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label>مساحة اللوح (م²)</Label>
              <Input
                type="number"
                step="0.01"
                value={settings.sheet_size_m2}
                onChange={(e) => updateSetting('sheet_size_m2', Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Clearances */}
        <div className="glass-card p-6">
          <h2 className="mb-6 text-lg font-semibold">الخلوصات والتداخلات</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>تداخل الحافة (مم)</Label>
              <Input
                type="number"
                value={settings.edge_overlap_mm}
                onChange={(e) => updateSetting('edge_overlap_mm', Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label>خلوص الظهر (مم)</Label>
              <Input
                type="number"
                value={settings.back_clearance_mm}
                onChange={(e) => updateSetting('back_clearance_mm', Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label>خلوص الأعلى (مم)</Label>
              <Input
                type="number"
                value={settings.top_clearance_mm}
                onChange={(e) => updateSetting('top_clearance_mm', Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label>خلوص الأسفل (مم)</Label>
              <Input
                type="number"
                value={settings.bottom_clearance_mm}
                onChange={(e) => updateSetting('bottom_clearance_mm', Number(e.target.value))}
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label>تداخل الجوانب (مم)</Label>
              <Input
                type="number"
                value={settings.side_overlap_mm}
                onChange={(e) => updateSetting('side_overlap_mm', Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Materials Pricing */}
        <div className="glass-card p-6">
          <h2 className="mb-6 text-lg font-semibold">أسعار المواد</h2>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>سعر لوح الخشب (ج.م)</Label>
              <Input
                type="number"
                value={settings.materials.plywood_sheet_price}
                onChange={(e) =>
                  updateSetting('materials', {
                    ...settings.materials,
                    plywood_sheet_price: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>سعر شريط الحافة (ج.م/متر)</Label>
              <Input
                type="number"
                value={settings.materials.edge_band_price}
                onChange={(e) =>
                  updateSetting('materials', {
                    ...settings.materials,
                    edge_band_price: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-end"
      >
        <Button variant="hero" size="lg" onClick={handleSave} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              حفظ الإعدادات
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
