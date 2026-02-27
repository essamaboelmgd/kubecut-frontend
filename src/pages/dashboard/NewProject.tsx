import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { projectsApi } from '@/lib/api';
import { trackCustomPixelEvent } from '@/lib/pixel';

export default function NewProject() {
  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !client) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء الحقول المطلوبة',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      await projectsApi.create({
        name,
        client_name: client,
        description,
      });

      trackCustomPixelEvent('CreateProject');

      toast({
        title: 'تم الإنشاء',
        description: 'تم إنشاء المشروع بنجاح',
      });

      navigate('/dashboard/projects');
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إنشاء المشروع',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
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
        <h1 className="text-2xl font-bold md:text-3xl">مشروع جديد</h1>
        <p className="mt-1 text-muted-foreground">
          أدخل تفاصيل المشروع الجديد
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        onSubmit={handleSubmit}
        className="glass-card space-y-6 p-8"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">اسم المشروع *</Label>
            <Input
              id="name"
              placeholder="مثال: مطبخ فيلا المعادي"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 bg-background/50 focus:bg-background transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client" className="text-sm font-medium">اسم العميل *</Label>
            <Input
              id="client"
              placeholder="مثال: أحمد محمد"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className="h-12 bg-background/50 focus:bg-background transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">وصف المشروع</Label>
            <Textarea
              id="description"
              placeholder="أضف وصفاً للمشروع (اختياري)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="bg-background/50 focus:bg-background transition-colors resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => navigate('/dashboard/projects')}
          >
            إلغاء
          </Button>
          <Button type="submit" variant="hero" className="flex-1" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                جاري الإنشاء...
              </>
            ) : (
              'إنشاء المشروع'
            )}
          </Button>
        </div>
      </motion.form>
    </div>
  );
}
