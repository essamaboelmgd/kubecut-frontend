import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, FolderKanban, Calendar, User2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { projectsApi, type Project } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function Projects() {
  const [search, setSearch] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsApi.getAll();
        setProjects(data);
      } catch (error) {
        toast({
          title: 'خطأ',
          description: 'فشل تحميل المشاريع',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [toast]);

  const filteredProjects = projects.filter(
    (p) =>
      p.name.includes(search) ||
      p.client_name.includes(search) ||
      p.description.includes(search)
  );

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">المشاريع</h1>
          <p className="mt-1 text-muted-foreground">
            إدارة جميع مشاريع المطابخ الخاصة بك
          </p>
        </div>
        <Button variant="hero" asChild>
          <Link to="/dashboard/projects/new">
            <Plus className="h-5 w-5" />
            مشروع جديد
          </Link>
        </Button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="relative max-w-md"
      >
        <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="ابحث في المشاريع..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-12 pr-10"
        />
      </motion.div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.project_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
            >
              <Link
                to={`/dashboard/projects/${project.project_id}`}
                className="glass-card group relative block h-full overflow-hidden p-6 transition-all duration-300 hover:shadow-glow hover:-translate-y-1"
              >
                {/* Decorative fade */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                
                <div className="relative z-10">
                  <div className="mb-5 flex items-start justify-between">
                    <div className="rounded-xl bg-primary/10 p-3 text-primary ring-1 ring-primary/20 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <FolderKanban className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-secondary/50 px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                      {project.status === 'completed' ? 'مكتمل' : 'قيد العمل'}
                    </span>
                  </div>

                  <div className="mb-4">
                    <h3 className="mb-2 text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                      {project.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {project.description || 'لا يوجد وصف'}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground/80">
                    <div className="flex items-center gap-1.5">
                      <User2 className="h-3.5 w-3.5" />
                      <span className="truncate max-w-[80px]">{project.client_name}</span>
                    </div>
                    <div className="h-1 w-1 rounded-full bg-border" />
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(project.updated_at || project.created_at).toLocaleDateString('ar-EG')}
                    </div>
                  </div>
                </div>

                <div className="relative z-10 mt-6 flex items-center justify-between border-t border-border/50 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-[10px] font-bold">
                       {project.units.length}
                    </span>
                    <span className="text-xs text-muted-foreground">وحدة</span>
                  </div>
                  <span className="flex items-center text-xs font-bold text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                    عرض التفاصيل ←
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      {!isLoading && filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card flex flex-col items-center justify-center py-16 text-center"
        >
          <FolderKanban className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-medium">لا توجد مشاريع</h3>
          <p className="mb-6 text-muted-foreground">
            {search ? 'لا توجد نتائج مطابقة للبحث' : 'ابدأ بإنشاء مشروعك الأول'}
          </p>
          {!search && (
            <Button variant="hero" asChild>
              <Link to="/dashboard/projects/new">
                <Plus className="h-5 w-5" />
                إنشاء مشروع
              </Link>
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
}
